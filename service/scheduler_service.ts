import {Consulta} from "../main/consulta";
import {IRepo} from "../repository/appointment_repo";

class Service{
    private repo: IRepo

    constructor(repo: IRepo) {
        this.repo = repo;
    }

}