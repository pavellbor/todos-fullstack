import { ConfigService } from "../../shared/libs/config-service";
import { EntryPointController } from "./entry-point.controller";
import { EntryPointService } from "./entry-point.service";

export const createEntryPointController = () => {
  const configService = new ConfigService<{ ROOT_HTML_PATH: string }>();
  const entryPointService = new EntryPointService(
    configService.get("ROOT_HTML_PATH")
  );
  const entryPointController = new EntryPointController(entryPointService);

  return entryPointController;
};
