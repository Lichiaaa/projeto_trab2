import { Consulta } from "../main/consulta";
import { IRepo } from "../repository/appointment_repo";

export class Service{
    private repo: IRepo

    constructor(repo: IRepo) {
        this.repo = repo;
    }

    agendar_consulta(nova_consulta: Consulta): Consulta | null {
        const consultas_existentes = this.repo.listar_todas();

        for (const consulta of consultas_existentes) {
            if (nova_consulta.se_sobrepoem(consulta)) {
                console.log("[ERROR]Conflito de agendamento, não é possivel agendar esta consulta.");
                return null;
            }
        }

        return this.repo.salvar_consulta(nova_consulta);
    }

    remover_consulta(id: number): void {
        this.repo.remover_consulta(id);
        console.log(`Consulta com ID ${id} removida (se existia).`);
    }

    private formatarData(date: Date): string {
        return date.toLocaleString("pt-BR", {
            timeZone: "UTC",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    imprimir_todas_consultas(): void {
        const consultas = this.repo.listar_todas();

        if (consultas.length === 0) {
            console.log("Nenhuma consulta agendada.");
            return;
        }
        for (const consulta of consultas) {
            console.log(
                `ID: ${consulta.getId()} | 
                Horário de início: ${consulta.getHora_inicio().toISOString()} | 
                Horário de termino: ${consulta.getHora_final().toISOString()} | 
                Descrição: ${consulta.getDescricao()}`
            );
        }
    }
}