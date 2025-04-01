import * as fs from 'fs-extra';
import * as path from 'path';

async function copyStaticFiles() {
  try {
    // Copy public directory
    await fs.copy(
      path.resolve(__dirname, 'public'),
      path.resolve(__dirname, 'dist/public'),
      {
        overwrite: true,
        preserveTimestamps: true,
      },
    );

    // Copy environment file if it exists
    if (await fs.pathExists(path.resolve(__dirname, '.env'))) {
      await fs.copy(
        path.resolve(__dirname, '.env'),
        path.resolve(__dirname, 'dist/.env'),
        {
          overwrite: true,
          preserveTimestamps: true,
        },
      );
    }

    // Copy form.html and error.html if they exist
    const htmlFiles = ['form.html', 'error.html'];
    for (const file of htmlFiles) {
      if (await fs.pathExists(path.resolve(__dirname, file))) {
        await fs.copy(
          path.resolve(__dirname, file),
          path.resolve(__dirname, 'dist', file),
          {
            overwrite: true,
            preserveTimestamps: true,
          },
        );
      }
    }

    console.log('Static files copied successfully');
  } catch (err) {
    console.error('Error copying static files:', err);
    process.exit(1);
  }
}

void copyStaticFiles();
