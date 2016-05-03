import { fileExists, readFile } from '../util/fs';
import Task from '../models/task';
import Blueprint from '../models/blueprint';

export default class extends Task {
  constructor(environment) {
    super(environment);
  }
  // extract options from json file
  jsonOption(jsonOption) {
    let filename, startKey, data;
    if(jsonOption.indexOf(':') !== -1){
      filename = jsonOption.substring(0, jsonOption.indexOf(':'));
      startKey = jsonOption.substring(jsonOption.indexOf(':')+1);
    } else {
      filename = jsonOption;
      startKey = null;
    }
    if(!fileExists(filename)){
      this.ui.writeError('JSON file does not exist: ' + filename);
      return process.exit(1);
    }

    data = JSON.parse(readFile(filename));

    if(startKey) {
      if(!data.hasOwnProperty(startKey)){
        this.ui.writeError('key does not exist in json: ' + startKey);
        return process.exit(1);
      }
      data = data[startKey];
    }

    return data;
  }
  // confirm blueprint exists
  // go fetch blueprint object
  // noramlize/setup args to be passed to install
  // install the blueprint
  run(blueprintName, cliArgs) {
    // if blueprint doesnt exist
      // this.ui.writeError(
        // 'this is not a valid blueprint. type help for help.. or w/e'
      // );
      // process.exit(1);
    // }
    const mainBlueprint = this.lookupBlueprint(blueprintName);
    const entity = {
      name: cliArgs.entity.name,
      options: Object.assign({}, (cliArgs.entity.json)?this.jsonOption(cliArgs.entity.json):{}, cliArgs.entity.options)
    };

    const blueprintOptions = {
      originalBlueprintName: blueprintName,
      ui: this.ui,
      settings: this.settings,
      entity
    };

    mainBlueprint.install(blueprintOptions);
  }

  lookupBlueprint(name) {
    return Blueprint.lookup(name);
  }
}
