import Database from "better-sqlite3";
import { Consulta } from "../main/consulta";

export interface IRepo {
    listar_todas(): Consulta[];
    salvar_consulta(consulta: Consulta): Consulta;
    remover_consulta(id: number): void;
    buscar_id(id: number): Consulta | null;
}

class SqLite_Appointment_Repo implements IRepo {
    private db: Database.Database;
    
    constructor(dbPath: string = "appointments.db") {
        this.db = new Database(dbPath);

        this.db.exec(
            `CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hora_inicio TEXT NOT NULL,
                hora_final   TEXT NOT NULL,
                descricao    TEXT NOT NULL
            );`
        );
    }

    listar_todas(): Consulta[]{
        const rows = this.db
        .prepare(
            `SELECT id, hora_inicio, hora_final, descricao
                FROM appointments
                ORDER BY hora_inicio`
        )
        .all();

    // Converte cada linha do banco em um objeto Consulta
        return rows.map((row: any) => {
            return new Consulta(
                row.id,
                new Date(row.hora_inicio),
                new Date(row.hora_final),
                row.descricao
            );
        });
    }

    salvar_consulta(consulta: Consulta): Consulta {
        const id = consulta.getId(); // pode ser undefined
        const start_iso = consulta.getHora_inicio().toISOString(); // UTC
        const end_iso = consulta.getHora_final().toISOString();    // UTC
        const descricao = consulta.getDescricao();

        if (id == null) {
      // INSERT (nova consulta)
            const stmt = this.db.prepare(
                `INSERT INTO appointments (start_datetime, end_datetime, description)
                    VALUES (?, ?, ?)`
                );

            const result = stmt.run(start_iso, end_iso, descricao);

      // atualiza o id dentro do objeto (se você tiver um setter ou algo similar)
            consulta.setId(Number(result.lastInsertRowid));

            return consulta;
        } 
        else {
      // UPDATE (consulta já existente)
            const stmt = this.db.prepare(
                `UPDATE appointments
                    SET hora_inicio = ?, hora_final = ?, descricao = ?
                    WHERE id = ?`
            );

            stmt.run(start_iso, end_iso, descricao, id);

            return consulta;
        }
    }

    remover_consulta(id: number): void {
        const stmt = this.db.prepare(
            `DELETE FROM appointments
                WHERE id = ?`
        );

        stmt.run(id);
    }

    buscar_id(id: number): Consulta | null {
        const row = this.db
        .prepare(
            `SELECT id, hora_inicio, hora_final, descricao
                FROM appointments
                WHERE id = ?`
        )
        .get(id);

        if (!row) {
            return null;
        }

        return new Consulta(
            row.id,
            new Date(row.hora_inicio),
            new Date(row.hora_final),
            row.descricao
            );
    }
}