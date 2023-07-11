Git Notes
=========

This is a collection of useful git commands to get you out of a sticky situation.

### Refresh Branches
```cmd
git fetch origin
git reset --hard origin/master
git clean -f -d
```
The above commands will synchronize the remote repo with the local repo. After the above command execution, your local repo will be like the mirror image of your remote repo.  
[Reference](https://stackoverflow.com/questions/27157166/sync-all-branches-with-git)

### Merging Branches
``` cmd
git checkout master
git pull
git checkout seotweaks
git merge -s ours master 
# or git merge --allow-unrelated-histories -s ours master
git checkout master
git merge seotweaks
```
The above commands will merge two different branches with unrelated histories.  
[Reference](https://stackoverflow.com/questions/2862590/how-to-replace-master-branch-in-git-entirely-from-another-branch)

### Uninstalling Dependencies
```cmd
npm uninstall package-name
```