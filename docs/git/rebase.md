# git rebase

> 前提：不要通过rebase对任何已经提交到公共仓库中的commit进行修改

## 合并多个commit为一个完整commit

当我们在本地仓库中提交了多次，在我们把本地提交push到公共仓库中之前，为了让提交记录更简洁明了，我们希望把如下分支B、C、D三个提交记录合并为一个完整的提交，然后再push到公共仓库。

<a data-fancybox title="示例" href="/notes/assets/git/2147642-42195cacced56729.webp">![示例](/notes/assets/git/2147642-42195cacced56729.webp)</a>

现在我们在测试分支上添加了四次提交，我们的目标是把最后三个提交合并为一个提交：

<a data-fancybox title="示例" href="/notes/assets/git/2147642-ce849c4eab3d803b.webp">![示例](/notes/assets/git/2147642-ce849c4eab3d803b.webp)</a>

这里我们使用命令:

```shell
git rebase -i  [startpoint]  [endpoint]
```

其中`-i`的意思是`--interactive`，即弹出交互式的界面让用户编辑完成合并操作，`[startpoint]` `[endpoint]`则指定了一个编辑区间，如果不指定`[endpoint]`，则该区间的终点默认是当前分支`HEAD`所指向的`commit`(注：该区间指定的是一个前开后闭的区间)。

在查看到了log日志后，我们运行以下命令：

```shell
git rebase -i 36224db
```

或:

```shell
git rebase -i HEAD~3 
```

然后我们会看到如下界面:

<a data-fancybox title="demo" href="/notes/assets/git/2147642-03d48aa767efb307.webp">![demo](/notes/assets/git/2147642-03d48aa767efb307.webp)</a>

上面未被注释的部分列出的是我们本次rebase操作包含的所有提交，下面注释部分是git为我们提供的命令说明。每一个`commit id` 前面的`pick`表示指令类型，`git` 为我们提供了以下几个命令:


* p，选择`<commit>` =使用提交

* r，改写`<commit>` =使用提交，但编辑提交消息

* e，编辑`<commit>` =使用提交，但停止进行修改

* s，squash `<commit>` =使用提交，但可以合并到先前的提交中

* f，fixup `<commit>` =类似于“ squash”，但丢弃此提交的日志消息

* x，exec <命令> =使用shell运行命令（该行的其余部分）

* b，break =在这里停止（稍后继续使用'git rebase --continue'进行重新设置）

* d，删除`<commit>` =删除提交

* l，label `<label>` =用名称标记当前HEAD

* t，重置`<label>` =将HEAD重置为标签

* m，合并`[-C <commit> | -c <commit>] <label> [＃<oneline>]`
 
    * 使用原始合并提交的创建合并提交
 
    * 消息（如果没有原始合并提交，则返回单行）
 
    * 指定的）。 使用-c `<commit>`改写提交消息。
    
这些行可以重新排序； 它们从上到下执行。
如果您在此处删除一行，那将丢失。
但是，如果删除所有内容，则重新定位将中止。

根据我们的需求，我们将commit内容编辑如下:

<a data-fancybox title="demo" href="/notes/assets/git/2147642-a651234e62ed20a5.webp">![demo](/notes/assets/git/2147642-a651234e62ed20a5.webp)</a>

然后是注释修改界面:

<a data-fancybox title="demo" href="/notes/assets/git/2147642-44bbd784dcadfb31.webp">![demo](/notes/assets/git/2147642-44bbd784dcadfb31.webp)</a>

编辑完保存即可完成commit的合并了：

<a data-fancybox title="demo" href="/notes/assets/git/2147642-334e0a5c47a24f87.webp">![demo](/notes/assets/git/2147642-334e0a5c47a24f87.webp)</a>

## 2.将某一段commit粘贴到另一个分支上

当我们项目中存在多个分支，有时候我们需要将某一个分支中的一段提交同时应用到其他分支中，就像下图：

<a data-fancybox title="demo" href="/notes/assets/git/2147642-0de010746cb78401.webp">![demo](/notes/assets/git/2147642-0de010746cb78401.webp)</a>

希望将`develop`分支中的C~E部分复制到`master`分支中，这时我们就可以通过`rebase`命令来实现（如果只是复制某一两个提交到其他分支，建议使用更简单的命令:`git cherry-pick`）。

在实际模拟中，我们创建了`master`和`develop`两个分支:

**master分支:**

<a data-fancybox title="demo" href="/notes/assets/git/2147642-c41f60d26b00cdfc.webp">![demo](/notes/assets/git/2147642-c41f60d26b00cdfc.webp)</a>

**develop分支:**

<a data-fancybox title="demo" href="/notes/assets/git/2147642-8519a024c88129c5.webp">![demo](/notes/assets/git/2147642-8519a024c88129c5.webp)</a>

我们使用命令的形式为:

```shell
git rebase [startpoint] [endpoint] --onto [branchName]
```

其中，`[startpoint]` `[endpoint]`仍然和上一个命令一样指定了一个编辑区间(前开后闭)，`--onto`的意思是要将该指定的提交复制到哪个分支上。

所以，在找到C(`90bc0045b`)和E(`5de0da9f2`)的提交id后，我们运行以下命令：

```shell
git rebase 90bc0045b 5de0da9f2 --onto master
```

注:因为`[startpoint]` `[endpoint]`指定的是一个前开后闭的区间，为了让这个区间包含C提交，我们将区间起始点向后退了一步。

运行完成后查看当前分支的日志:

<a data-fancybox title="demo" href="/notes/assets/git/2147642-de397671caac1966.webp">![demo](/notes/assets/git/2147642-de397671caac1966.webp)</a>

可以看到，C~E部分的提交内容已经复制到了G的后面了，大功告成？NO！我们看一下当前分支的状态:

<a data-fancybox title="demo" href="/notes/assets/git/2147642-cfd21fdb1e4038bc.webp">![demo](/notes/assets/git/2147642-cfd21fdb1e4038bc.webp)</a>

当前HEAD处于游离状态，实际上，此时所有分支的状态应该是这样:

<a data-fancybox title="" href="/notes/assets/git/2147642-a3bbfea6d760f64a.webp">![](/notes/assets/git/2147642-a3bbfea6d760f64a.webp)</a>

所以，虽然此时HEAD所指向的内容正是我们所需要的，但是master分支是没有任何变化的，git只是将C~E部分的提交内容复制一份粘贴到了master所指向的提交后面，我们需要做的就是将master所指向的提交id设置为当前HEAD所指向的提交id就可以了，即:

```shell
git checkout master
git reset --hard  0c72e64
```

![](/notes/assets/git/2147642-003361cb0305c094.webp)

