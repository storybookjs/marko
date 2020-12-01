import fs from 'fs-extra';
import path from 'path';
import { parseStaticDir } from './static-files';

fs.pathExists = jest.fn().mockReturnValue(true);

describe('parseStaticDir', () => {
  it('returns the static dir/path and default target', async () => {
    await expect(parseStaticDir('public')).resolves.toEqual({
      staticDir: './public',
      staticPath: path.resolve('public'),
      targetDir: './',
      targetEndpoint: '/',
    });

    await expect(parseStaticDir('foo/bar')).resolves.toEqual({
      staticDir: './foo/bar',
      staticPath: path.resolve('foo/bar'),
      targetDir: './',
      targetEndpoint: '/',
    });
  });

  it('returns the static dir/path and custom target', async () => {
    await expect(parseStaticDir('public:/custom-endpoint')).resolves.toEqual({
      staticDir: './public',
      staticPath: path.resolve('public'),
      targetDir: './custom-endpoint',
      targetEndpoint: '/custom-endpoint',
    });

    await expect(parseStaticDir('foo/bar:/custom-endpoint')).resolves.toEqual({
      staticDir: './foo/bar',
      staticPath: path.resolve('foo/bar'),
      targetDir: './custom-endpoint',
      targetEndpoint: '/custom-endpoint',
    });
  });

  it('supports absolute file paths', async () => {
    await expect(parseStaticDir('/foo/bar')).resolves.toEqual({
      staticDir: '/foo/bar',
      staticPath: '/foo/bar',
      targetDir: './',
      targetEndpoint: '/',
    });

    await expect(parseStaticDir('C:\\foo\\bar')).resolves.toEqual({
      staticDir: expect.any(String), // can't test this properly on unix
      staticPath: path.resolve('C:\\foo\\bar'),
      targetDir: './',
      targetEndpoint: '/',
    });
  });

  it('supports absolute file paths with custom endpoint', async () => {
    await expect(parseStaticDir('/foo/bar:/custom-endpoint')).resolves.toEqual({
      staticDir: '/foo/bar',
      staticPath: '/foo/bar',
      targetDir: './custom-endpoint',
      targetEndpoint: '/custom-endpoint',
    });

    await expect(parseStaticDir('C:\\foo\\bar:/custom-endpoint')).resolves.toEqual({
      staticDir: expect.any(String), // can't test this properly on unix
      staticPath: path.resolve('C:\\foo\\bar'),
      targetDir: './custom-endpoint',
      targetEndpoint: '/custom-endpoint',
    });
  });

  it('pins relative endpoint at root', async () => {
    const normal = await parseStaticDir('public:relative-endpoint');
    expect(normal.targetEndpoint).toBe('/relative-endpoint');

    const windows = await parseStaticDir('C:\\public:relative-endpoint');
    expect(windows.targetEndpoint).toBe('/relative-endpoint');
  });

  it('checks that the path exists', async () => {
    fs.pathExists = jest.fn().mockReturnValueOnce(false);
    await expect(parseStaticDir('nonexistent')).rejects.toThrow(path.resolve('nonexistent'));
  });
});
