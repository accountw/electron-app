import { ControllerBase } from "../lib/ControllerBase";
import { Decorator } from "../lib/Decorator";
import { MainServer } from "../service/MainService";


export class MainController extends ControllerBase {

    @Decorator.Inject(MainServer)
    public mainServer: MainServer;


    @Decorator.Ipc("test")
    log() {
        this.mainServer.log();
    }
}
