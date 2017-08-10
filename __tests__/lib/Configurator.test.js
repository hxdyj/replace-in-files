/* eslint-disable global-require */

describe('lib/Configurator.js', () => {
  test('constructor', () => {
    const Configurator = require('../../lib/Configurator.js');
    const options = 'options';

    const validator = new Configurator(options);

    expect(validator.options).toBe(options);
    expect(validator.findFilesOptions).toBeNull();
    expect(validator.loggerOptions).toBeNull();
    expect(validator.replaceOptions).toBeNull();
  });
  test('run', () => {
    const Configurator = require('../../lib/Configurator.js');
    Configurator.prepareFindFilesConfig = fn();
    Configurator.prepareReplaceConfig = fn();
    const options = 'options';
    const mocThis = { options };

    const validator = new Configurator();
    validator.run.call(mocThis);

    expect(Configurator.prepareFindFilesConfig).toHaveBeenCalledTimes(1);
    expect(Configurator.prepareFindFilesConfig).toHaveBeenCalledWith(options);

    expect(Configurator.prepareReplaceConfig).toHaveBeenCalledTimes(1);
    expect(Configurator.prepareReplaceConfig).toHaveBeenCalledWith(options);
  });
  describe('prepareFindFilesConfig', () => {
    test('1', () => {
      const Configurator = require('../../lib/Configurator.js');
      const config = require('../../lib/config.json');
      config.Configurator.defaultOptionsForFiles = {
        ignore: [
          '/ignore/first/path',
          '**/ingonre/regexp.*'
        ],
        foo: 'bar'
      };
      const options = {
        another: 'field',
        files: 'pathToFiles',
        optionsForFiles: {
          key1: 'value1',
          key2: 'value2'
        }
      };

      const result = Configurator.prepareFindFilesConfig(options);

      expect(result).toEqual({
        files: 'pathToFiles',
        optionsForFiles: {
          ignore: [
            '/ignore/first/path',
            '**/ingonre/regexp.*'
          ],
          foo: 'bar',
          key1: 'value1',
          key2: 'value2'
        }
      });
    });
    test('2', () => {
      const Configurator = require('../../lib/Configurator.js');
      const config = require('../../lib/config.json');
      config.Configurator.defaultOptionsForFiles = {
        ignore: [
          '/ignore/first/path',
          '**/ingonre/regexp.*'
        ],
        foo: 'bar',
        qwerty: 123
      };
      const options = {
        another: 'field',
        files: 'pathToFiles',
        optionsForFiles: {
          ignore: [
            'new/path/instead/default/paths'
          ],
          key1: 'value1',
          foo: 'newBar'
        }
      };

      const result = Configurator.prepareFindFilesConfig(options);

      expect(result).toEqual({
        files: 'pathToFiles',
        optionsForFiles: {
          ignore: [
            'new/path/instead/default/paths'
          ],
          key1: 'value1',
          foo: 'newBar',
          qwerty: 123
        }
      });
    });
    test('3', () => {
      const Configurator = require('../../lib/Configurator.js');
      const config = require('../../lib/config.json');
      config.Configurator.defaultOptionsForFiles = {
        ignore: [
          '/ignore/first/path',
          '**/ingonre/regexp.*'
        ],
        foo: 'bar',
        qwerty: 123
      };
      const options = {
        another: 'field',
        files: 'pathToFiles',
        optionsForFiles: {
          ignore: [],
          key1: 'value1',
          foo: 'newBar'
        }
      };

      const result = Configurator.prepareFindFilesConfig(options);

      expect(result).toEqual({
        files: 'pathToFiles',
        optionsForFiles: {
          ignore: [],
          key1: 'value1',
          foo: 'newBar',
          qwerty: 123
        }
      });
    });
  });
  describe('prepareReplaceConfig', () => {
    test('1', () => {
      const Configurator = require('../../lib/Configurator.js');
      const config = require('../../lib/config.json');
      config.Configurator.defaultEncoding = 'utf16';
      const options = {
        another: 'field',
        files: 'pathToFiles',
        from: 'from',
        to: 'to',
        encoding: 'utf32'
      };

      const result = Configurator.prepareReplaceConfig(options);

      expect(result).toEqual({
        from: 'from',
        to: 'to',
        encoding: 'utf32'
      });
    });
    test('2', () => {
      const Configurator = require('../../lib/Configurator.js');
      const config = require('../../lib/config.json');
      config.Configurator.defaultEncoding = 'utf16';
      const options = {
        another: 'field',
        files: 'pathToFiles',
        from: 'from',
        to: 'to',
      };

      const result = Configurator.prepareReplaceConfig(options);

      expect(result).toEqual({
        from: 'from',
        to: 'to',
        encoding: 'utf16'
      });
    });
  });
});
