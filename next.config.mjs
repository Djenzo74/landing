import locales from './src/const/locales.mjs';
import svgr from 'next-plugin-svgr';
import withPlugins from 'next-compose-plugins';
import images from 'next-images';
import { globby } from 'globby';
import { relative, join } from 'path';

export const defaultLocale = 'en';

export const nextConfig = {
    trailingSlash: true,
    i18n: {
        locales,
        defaultLocale,
    },
    experimental: {
        outputStandalone: true,

        // this is to prevent translation API key from getting rate limited
        // this does mean the non-translated pages build slower, but eh.
        cpus: 1,
        workerThreads: false,
    },
    async redirects() {
        // Redirects public files that were accidentally prefixed with a locale.
        const paths = await globby('./public/**/*', { expandDirectories: false });
        return locales.flatMap((locale) =>
            locale !== defaultLocale
                ? paths.map((path) => {
                      const relativePath = join('/', relative('./public', path));
                      return {
                          source: `/${locale}${relativePath}`,
                          destination: relativePath,
                          permanent: false,
                          locale: false,
                      };
                  })
                : []
        );
    },
};

export default withPlugins([svgr, [images, { fileExtensions: ['jpg', 'jpeg', 'png', 'gif'] }]], nextConfig);
