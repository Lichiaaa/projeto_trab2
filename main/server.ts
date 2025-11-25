import express from "express";
import cors from "cors";
import path from "path";

import { SqLite_Appointment_Repo } from "../repository/appointment_repo";
import { Service } from "../service/scheduler_service";
import { Consulta } from "./consulta";

// ---------- configuração básica ----------
const app = express();
const PORT = 3000;

// habilita JSON no body
app.use(express.json());
// libera acesso do front (se abrir via file:// ou outra porta)
app.use(cors());

// instancia o repo + service UMA vez
const repo = new SqLite_Appointment_Repo("appointments.db");
const service = new Service(repo);

// função que você já usou na CLI
function parseDateTime(dataStr: string, horaStr: string): Date {
    const [diaStr, mesStr, anoStr] = dataStr.split("/");
    const [horaStr2, minStr] = horaStr.split(":");

    const dia = Number(diaStr);
    const mes = Number(mesStr);
    const ano = Number(anoStr);
    const hora = Number(horaStr2);
    const minuto = Number(minStr);

    return new Date(Date.UTC(ano, mes - 1, dia, hora, minuto));
}

// ---------- rotas da API ----------

// GET /appointments -> lista todas em JSON
app.get("/appointments", (req, res) => {
    const consultas = repo.listar_todas();

    const resposta = consultas.map(c => ({
        id: c.getId(),
        hora_inicio: c.getHora_inicio().toISOString(),  // ISO / UTC
        hora_final: c.getHora_final().toISOString(),
        descricao: c.getDescricao()
    }));

    res.json(resposta);
});

// POST /appointments -> cria uma nova
app.post("/appointments", (req, res) => {
    const { data, horaInicio, horaFinal, descricao } = req.body;

    if (!data || !horaInicio || !horaFinal || !descricao) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando." });
    }

    const inicio = parseDateTime(data, horaInicio);
    const fim = parseDateTime(data, horaFinal);

    const novaConsulta = new Consulta(undefined, inicio, fim, descricao);

    const resultado = service.agendar_consulta(novaConsulta);

    if (resultado === null) {
        // conflito de horário
        return res.status(409).json({ erro: "Conflito de agendamento." });
    }

    return res.status(201).json({
        id: resultado.getId(),
        hora_inicio: resultado.getHora_inicio().toISOString(),
        hora_final: resultado.getHora_final().toISOString(),
        descricao: resultado.getDescricao()
    });
});

// DELETE /appointments/:id -> remove
app.delete("/appointments/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido." });
    }

    repo.remover_consulta(id);
    return res.status(204).send(); // sem conteúdo
});

// ---------- servir o HTML estático ----------
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
