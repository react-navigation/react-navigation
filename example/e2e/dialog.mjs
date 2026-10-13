export function run(page, env) {
  const listener = async (dialog) => {
    if (env.action === 'accept') {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }

    page.off('dialog', listener);
  };

  page.on('dialog', listener);
}
