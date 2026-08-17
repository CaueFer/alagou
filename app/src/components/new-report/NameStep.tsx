import { Input } from "@/components/ui/input";

interface NameStepProps {
  username: string;
  onChangeUsername: (value: string) => void;
}

export function NameStep({ username, onChangeUsername }: NameStepProps) {
  return (
    <div className="flex flex-col gap-2 px-4">
      <label htmlFor="username" className="text-sm font-medium">
        Seu nome (opcional)
      </label>
      <Input
        id="username"
        placeholder="Anônimo"
        value={username}
        onChange={(event) => onChangeUsername(event.target.value)}
        maxLength={40}
      />
      <p className="text-sm text-muted-foreground">
        Se deixado em branco, o relato será exibido como "Anônimo".
      </p>
    </div>
  );
}
