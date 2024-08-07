import { Decorator } from "../lib/Decorator";

@Decorator.Injectable
export class MainServer {
    log() {
        console.log("++++++++++++++++++++++++++++++")
    }
}