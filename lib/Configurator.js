const _ = require('lodash');
const config = require('./config.json');
const fs = require('fs')
const path = require('path')
class Configurator {
  static prepareFindFilesConfig({ files, optionsForFiles: srcOptionsForFiles }) {
    let optionsForFiles = config.Configurator.defaultOptionsForFiles;
    if (srcOptionsForFiles) {
      optionsForFiles = _.assign(optionsForFiles, srcOptionsForFiles);
    }
    optionsForFiles = _.assign(optionsForFiles, { nodir: true });

    return {
      files,
      optionsForFiles
    };
  }

  static prepareReplaceConfig({
    from,
    to,
    replaceFileOnlyIfMatchRegxpInFile = null,
    shouldSkipBinaryFiles = config.Configurator.shouldSkipBinaryFiles,
    encoding = config.Configurator.defaultEncoding,
    onlyFindPathsWithoutReplace = config.Configurator.defaultOnlyFindPathsWithoutReplace,
    saveOldFile = config.Configurator.defaultSaveOldFile,
    extractPath = config.Configurator.defaultExtractPath,
  }) {
    const onlyFind = to ? onlyFindPathsWithoutReplace : true;

    return {
      from,
      to,
      shouldSkipBinaryFiles,
      encoding,
      onlyFindPathsWithoutReplace: onlyFind,
      replaceFileOnlyIfMatchRegxpInFile,
      saveOldFile: onlyFind ? false : saveOldFile,
      step: 0, // in ReplaceInFiles.pipesHandlerActions reassigned
      extractPath
    };
  }

  static prepareLoggerConfig({
    returnCountOfMatchesByPaths = config.Configurator.defaultReturnCountOfMatchesByPaths,
    returnReplaceInFilesOptions = config.Configurator.defaultReplaceInFilesOptions,
    returnPaths = config.Configurator.defaultReturnPaths
  }) {
    return {
      returnCountOfMatchesByPaths,
      returnReplaceInFilesOptions,
      returnPaths,
    };
  }

  constructor(options) {
    this.options = options;

    this.findFilesOptions = null;
    this.loggerOptions = null;
    this.replaceOptions = null;
  }

  run() {
    const configs = {
      findFilesOptions: Configurator.prepareFindFilesConfig(this.options),
      loggerOptions: Configurator.prepareLoggerConfig(this.options),
      replaceOptions: Configurator.prepareReplaceConfig(this.options),
    };

    let{ extractPath,encoding,onlyFindPathsWithoutReplace }= configs.replaceOptions
    if(onlyFindPathsWithoutReplace&&extractPath){
      let arr = extractPath.split('/')
      let fileName = arr[arr.length-1]
      let ePath = extractPath.replace(fileName,'')
      let writePath = path.resolve(ePath)
      fs.mkdir( writePath, { recursive: true }, async(err) => {
        if (err) throw err;
        await fs.writeFileSync(writePath+'/'+fileName, '',{
          encoding,
          flag:'w'
        });
      });

    }
    return configs;
  }
}

module.exports = Configurator;
