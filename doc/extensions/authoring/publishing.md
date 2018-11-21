# Publishing a Sourcegraph Extension

Publishing a Sourcegraph extension is fast and easy. It simply involves building (compiling and bundling) one or more TypeScript files into a single JavaScript file.

When [setting up your development environment](development_environment.md), you'll already have:

1. Installed the [Sourcegraph CLI (`src`)](https://github.com/sourcegraph/src-cli#installation)
1. [Configured `src` with an access token](https://github.com/sourcegraph/src-cli#authentication)

Now you can publish your extension by running:

```shell
src extensions publish
```

At this point your extension has been built and sent to Sourcegraph. The output will include a link to a detail page where you can enable your extension and start using it.

> Any user can publish to the Sourcegraph.com extension registry, and all Sourcegraph instances can use extensions from Sourcegraph.com. To publish extensions *privately* so that they're only visible to you, use a [private extension registry](../../admin/extensions/index.md).

## Testing Your Extension

Your extension will need to be published to Sourcegraph.com or an Enterprise instance in order for it to be tested. While we are working on [publishing to a local instance for testing](https://github.com/sourcegraph/sourcegraph/issues/489), flagging your extension as a work-in-progress (WIP) is the best solution for now.

### WIP Extensions

An extension with no published releases, or whose title begins with `WIP:` or `[WIP]`, is considered a work-in-progress (WIP) extension. WIP extensions:

- Are not shown in the initial list of extensions on the extension registry. (They are only shown when the user has typed in a query).
- Are sorted last on the list of extensions when there is a query (unless the user has already added the WIP extension).
- Have a red "Work in progress" badge on the extension card in the list.
- Have a red "Work in progress" badge on the extension's page.

You can use WIP extensions for testing in-development extensions, as well as new versions of an existing extension.

## Refreshing Extension Code Without Republishing

When iterating on your extension, each code change requires republishing. You can avoid this by using the Parcel bundler's development server to override the URL for the extension file when publishing. This lets you see the latest changes in your browser by reloading the page, without republishing.

To set this up:

1. If the extension is in use, add a `wip-` prefix to the current name and a `WIP:` or `[WIP]` to the title.

1. In a terminal window, run `npm run serve` in your extension's directory to run the Parcel dev server. Wait until it reports that it's listening on http://localhost:1234 (or another port number).

1. In another terminal window, run `src extensions publish -url http://localhost:1234/my-extension.js` (`my-extension.js` This is the bundled JavaScript file in your `dist` directory, and it works for you because the browser will load your extension from http://localhost:1234/my-extension.js.

1. Make a change inside `src`, then save. Your code will be re-bundled and a reload of the browser window will cause your changes to be loaded.

### When You Are Ready to Publish

You've written the code, you've tested your extension, and now you're almost ready to publish. Lastly, you'll need to remove the WIP extension:

1. Open the WIP extension detail page
- Click the **Manage** tab
- Click the **Delete extension** button

Now publish the extension:

```
run src extensions publish`
```
