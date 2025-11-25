import { SqLite_Appointment_Repo } from "../repository/appointment_repo";
import { Service } from "../service/scheduler_service";
import { Consulta } from "./consulta";

function main() {
    // 1) Instanciar o repo e o service
    const repo = new SqLite_Appointment_Repo("appointments.db");
    const service = new Service(repo);

    // 2) Criar uma consulta sem conflito
    const consulta1 = new Consulta(
        undefined, // id indefinido -> repo vai fazer INSERT
        new Date("2025-02-25T10:00:00Z"),
        new Date("2025-02-25T11:00:00Z"),
        "Consulta 1 - sem conflito"
    );

    // 3) Criar outra consulta que CONFLITA com a primeira
    const consulta2 = new Consulta(
        undefined,
        new Date("2025-02-25T10:30:00Z"),  // dentro do intervalo da 1
        new Date("2025-02-25T11:30:00Z"),
        "Consulta 2 - deveria dar conflito"
    );

    // 4) Agendar as duas
    console.log("\n>>> Agendando consulta 1");
    const r1 = service.agendar_consulta(consulta1);
    console.log("Resultado 1:", r1);

    console.log("\n>>> Agendando consulta 2 (esperado: conflito)");
    const r2 = service.agendar_consulta(consulta2);
    console.log("Resultado 2:", r2);

    // 5) Listar tudo que ficou salvo
    console.log("\n>>> Consultas salvas no banco:");
    service.imprimir_todas_consultas();
}

main();
