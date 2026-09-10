#!/usr/bin/env python3
"""Sobe o ambiente de desenvolvimento completo do Alagou.

Ordem: garante o .env, sobe Postgres/RabbitMQ via docker compose, espera os
dois ficarem saudaveis, instala dependencias do frontend se necessario, e
inicia backend (Spring Boot) e frontend (Vite) em paralelo, com a saida dos
dois entrelacada no mesmo terminal.

Uso: python dev-up.py
Encerrar com Ctrl+C: para backend e frontend; os containers do docker
continuam rodando em segundo plano (uso normal de banco de dados em dev).
"""

import shutil
import signal
import subprocess
import sys
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
API_DIR = ROOT / "api"
APP_DIR = ROOT / "app"
ENV_FILE = ROOT / ".env"
ENV_EXAMPLE = ROOT / ".env.example"

IS_WINDOWS = sys.platform.startswith("win")
BACKEND_PORT = 8080
FRONTEND_PORT = 5173
CONTAINERS_TO_AWAIT = ["alagou-db", "alagou-rabbitmq"]
HEALTH_TIMEOUT_SECONDS = 120

processes = []
shutting_down = False


def force_utf8_streams():
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure is not None:
            reconfigure(encoding="utf-8", errors="replace")


def log(tag, message):
    print("[{}] {}".format(tag, message), flush=True)


def fail(message):
    log("setup", "erro: " + message)
    sys.exit(1)


def resolve_executable(name):
    path = shutil.which(name)
    if path is None:
        fail("'{}' nao foi encontrado no PATH".format(name))
    return path


def run_checked(cmd, cwd):
    log("setup", "$ " + " ".join(cmd))
    result = subprocess.run(cmd, cwd=str(cwd))
    if result.returncode != 0:
        fail("comando falhou ({}): {}".format(result.returncode, " ".join(cmd)))


def ensure_env_file():
    if ENV_FILE.exists():
        log("setup", ".env ja existe, mantendo como esta")
        return
    if not ENV_EXAMPLE.exists():
        log("setup", "aviso: .env.example nao encontrado, pulando criacao de .env")
        return
    shutil.copyfile(ENV_EXAMPLE, ENV_FILE)
    log(
        "setup",
        ".env criado a partir de .env.example (valores de exemplo bastam para rodar local; "
        "edite WORLDTIDES_API_KEY/JWT_SECRET/etc. se for alem disso)",
    )


def docker_compose_up():
    docker = resolve_executable("docker")
    run_checked([docker, "compose", "up", "-d"], cwd=ROOT)


def container_health(docker, name):
    result = subprocess.run(
        [docker, "inspect", "--format", "{{.State.Health.Status}}", name],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return None
    return result.stdout.strip()


def wait_for_healthy_containers():
    docker = resolve_executable("docker")
    pending = set(CONTAINERS_TO_AWAIT)
    log("setup", "aguardando containers ficarem saudaveis: " + ", ".join(sorted(pending)))
    deadline = time.time() + HEALTH_TIMEOUT_SECONDS
    while pending:
        for name in list(pending):
            status = container_health(docker, name)
            if status == "healthy":
                pending.discard(name)
                log("setup", "{}: healthy".format(name))
            elif status is None:
                fail("container '{}' nao encontrado (docker compose up falhou?)".format(name))
        if pending and time.time() >= deadline:
            fail("tempo esgotado esperando ficarem saudaveis: " + ", ".join(sorted(pending)))
        if pending:
            time.sleep(2)


def ensure_frontend_dependencies():
    if (APP_DIR / "node_modules").exists():
        return
    log("setup", "node_modules ausente em app/, rodando npm install")
    npm = resolve_executable("npm")
    run_checked([npm, "install"], cwd=APP_DIR)


def backend_command():
    wrapper_name = "mvnw.cmd" if IS_WINDOWS else "mvnw"
    wrapper = API_DIR / wrapper_name
    if wrapper.exists():
        return [str(wrapper), "spring-boot:run"]
    return [resolve_executable("mvn"), "spring-boot:run"]


def frontend_command():
    return [resolve_executable("npm"), "run", "dev"]


def stream_output(tag, pipe):
    try:
        for line in iter(pipe.readline, ""):
            if line == "":
                break
            print("[{}] {}".format(tag, line.rstrip()), flush=True)
    finally:
        pipe.close()


def start_process(tag, cmd, cwd):
    log("setup", "iniciando {}: {}".format(tag, " ".join(cmd)))
    process = subprocess.Popen(
        cmd,
        cwd=str(cwd),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
    )
    processes.append(process)
    thread = threading.Thread(target=stream_output, args=(tag, process.stdout), daemon=True)
    thread.start()
    return process


def shutdown():
    global shutting_down
    if shutting_down:
        return
    shutting_down = True
    log("setup", "encerrando backend e frontend (os containers do docker continuam rodando)...")
    for process in processes:
        if process.poll() is None:
            process.terminate()
    for process in processes:
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()


def handle_sigint(signum, frame):
    shutdown()
    sys.exit(0)


def main():
    force_utf8_streams()
    signal.signal(signal.SIGINT, handle_sigint)

    ensure_env_file()
    docker_compose_up()
    wait_for_healthy_containers()
    ensure_frontend_dependencies()

    backend = start_process("backend", backend_command(), API_DIR)
    frontend = start_process("frontend", frontend_command(), APP_DIR)

    log("setup", "backend subindo em http://localhost:{}".format(BACKEND_PORT))
    log("setup", "frontend subindo em http://localhost:{}".format(FRONTEND_PORT))
    log("setup", "Ctrl+C encerra backend e frontend (containers do docker continuam de pe)")

    try:
        while True:
            if backend.poll() is not None:
                fail("backend encerrou inesperadamente (codigo {})".format(backend.returncode))
            if frontend.poll() is not None:
                fail("frontend encerrou inesperadamente (codigo {})".format(frontend.returncode))
            time.sleep(1)
    except KeyboardInterrupt:
        shutdown()


if __name__ == "__main__":
    main()
