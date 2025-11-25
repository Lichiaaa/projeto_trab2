export class Consulta{
    private id?: number | undefined;
    private hora_inicio: Date;
    private hora_final: Date;
    private descricao: string;

    constructor(id: number | undefined, hora_inicio: Date, hora_final: Date, descricao: string) {
        this.id = id;
        this.hora_inicio = hora_inicio;
        this.hora_final = hora_final;
        this.descricao = descricao;
    }

    se_sobrepoem(outra: Consulta): boolean {
        if(this.hora_final > outra.hora_inicio && this.hora_inicio < outra.hora_final){
            return true;
        }
        return false;
    }

    getId(): number | undefined {
        return this.id;
    }

    getHora_inicio(): Date {
        return this.hora_inicio;
    }

    getHora_final(): Date {
        return this.hora_final;
    }

    getDescricao(): string{
        return this.descricao;
    }

    setId(novo_id: number) {
        this.id = novo_id;
    }
}