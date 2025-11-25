import { SqLite_Appointment_Repo } from "../repository/appointment_repo";
import { Service } from "../service/scheduler_service";
import { Consulta } from "../main/consulta";

// converte "dd/mm/aaaa" + "hh:mm" -> Date em UTC
function parseDateTime(dataStr: string, horaStr: string): Date {
    const [diaStr, mesStr, anoStr] = dataStr.split("/");
    const [horaStr2, minStr] = horaStr.split(":");

    const dia = Number(diaStr);
    const mes = Number(mesStr);    // 1–12
    const ano = Number(anoStr);
    const hora = Number(horaStr2);
    const minuto = Number(minStr);

    // Date.UTC usa mês 0–11
    return new Date(Date.UTC(ano, mes - 1, dia, hora, minuto));
}

function mostrarUso() {
    console.log(`
Uso:
  ts-node cli/cli.ts list
    -> lista todas as consultas

  ts-node cli/cli.ts add <dd/mm/aaaa> <hh:mm_inicio> <hh:mm_fim> "descrição"
    -> adiciona uma consulta

  ts-node cli/cli.ts remove <id>
    -> remove uma consulta pelo ID
`);
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        mostrarUso();
        return;
    }

    const comando = args[0];

    // instancia o repo + service uma vez só
    const repo = new SqLite_Appointment_Repo("appointments.db");
    const service = new Service(repo);

    switch (comando) {
        case "list": {
            service.imprimir_todas_consultas();
            break;
        }

        case "add": {
            if (args.length < 5) {
                console.log("[ERROR] Faltam argumentos para o comando 'add'.");
                mostrarUso();
                return;
            }

    const dataStr = args[1]; //dd/mm/aaaa
    const horaInicioStr = args[2]; //hh:mm
    const horaFinalStr = args[3]; //hh:mm
    const descricao = args.slice(4).join(" "); // junta o resto como descrição

    if (!dataStr || !horaInicioStr || !horaFinalStr) {
        console.log("[ERROR] Argumentos inválidos para o comando 'add'.");
        mostrarUso();
        return;
    }

    const inicio = parseDateTime(dataStr, horaInicioStr);
    const fim = parseDateTime(dataStr, horaFinalStr);


            const novaConsulta = new Consulta(
                undefined,
                inicio,
                fim,
                descricao
            );

            const resultado = service.agendar_consulta(novaConsulta);

            if (resultado === null) {
                console.log("Não foi possível agendar a consulta (conflito).");
            } else {
                console.log("Consulta agendada com sucesso!");
            }

            break;
        }

        case "remove": {
            if (args.length < 2) {
                console.log("[ERROR] Faltam argumentos para o comando 'remove'.");
                mostrarUso();
                return;
            }

            const id = Number(args[1]);
            if (Number.isNaN(id)) {
                console.log("[ERROR] ID inválido.");
                return;
            }

            service.remover_consulta(id);
            break;
        }

        default:
            console.log(`[ERROR] Comando desconhecido: ${comando}`);
            mostrarUso();
            break;
    }
}

main();
