## Contributing

First off, thank you for considering contributing to A Shopify Theme with Themekit and Webpack. It's exciting to see what we can do with modern build tools.

### Where do I go from here?

If you notice a bug or have a feature request, [make one](https://github.com/activeadmin/activeadmin/issues/new)! I'm no pro, creating issues helps improve this repo and helps learn about all that is involved building themes.
Please make sure to check the [CODE_OF_CONDUCT.md](https://github.com/3daddict/themekit-webpack/blob/master/CODE_OF_CONDUCT.md) before contributing to this repo.

### Fork & create a branch

If there is something you think you can fix, then [fork themekit-webpack](https://help.github.com/articles/fork-a-repo) and create
a branch with a descriptive name.

A good branch name would be (where issue #33 is the ticket you're working on):

```sh
git checkout -b 33-add-infinite-scroll-feature
```

### Verify build with ESLint
When testing your new feature ensure you are passing ESLint rules by running
```sh
yarn build
```
Make note of any errors that get flagged from ESLint and fix before creating a PR.

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's
up to date with themekit-webpack's master branch:

```sh
git remote add upstream git@github.com:themekit-webpack/themekit-webpack.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 33-add-infinite-scroll-feature
git rebase master
git push --set-upstream origin 33-add-infinite-scroll-feature
```
Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) 😎
### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of good [git rebasing](http://git-scm.com/book/en/Git-Branching-Rebasing) [resources](https://help.github.com/en/github/using-git/about-git-rebase) but here's the suggested workflow:

```sh
git checkout 33-add-infinite-scroll-feature
git pull --rebase upstream master
git push --force-with-lease 33-add-infinite-scroll-feature
```
### Merging a PR (maintainers only)

A PR can only be merged into `master` by a maintainer if:

* It is passing ESLint.
* It has no requested changes.
* It is up to date with current master.

Any maintainer is allowed to merge a PR if all of these conditions are met.
