---
title: ASP_SaveTitle
file: ASP_SaveTitle.js
branch: beta/save-title
date: 2020-02-17
tags: [ beta ]
---

セーブデータのタイトルに任意の文字列を設定します。

## 目的

デフォルトのセーブ画面では、セーブスロットの一つ一つにゲームのタイトルが表示されます。
セーブの数が増えると、セーブ画面全体に同じ文字列が並ぶことになります。

また、ゲームの再開にのための情報がデータ番号と隊列、プレイ時間のみになっています。

このプラグインでは、セーブデータのゲームのタイトルを指定できるようにすることで、この問題の改善を狙います。

## パラメータ

### Default

デフォルトのセーブタイトル テンプレートを設定します。[制御文字](#制御文字)が利用できます。

## プラグインコマンド

### SetSaveTitle

セーブタイトル テンプレートを設定します。

```
SetSaveTitle {title}
```

* `title`: セーブタイトル テンプレート文字列。[制御文字](#制御文字)が利用できます。


## 制御文字

セーブタイトル テンプレート文字列の設定時には、制御文字の一部が使用可能です。

* `\N[n]`: n 番目のアクターの名前に置換されます。

* `\P[n]`: パーティ n 番目のアクターの名前に置換されます。

* `\V[n]`: 変数 n 番の値に置換されます。

## スクリーンショット

<div class="image-group">
<figure>
<img src="img/ASP_SaveTitle/1.png" />
<figcaption>
<code>\P[1]</code>制御文字を使用した例。パーティ先頭のアクター名が使用される。
</figcaption>
</figure>

<figure>
<img src="img/ASP_SaveTitle/2.png" />
<figcaption>
<code>\N[1]</code>制御文字を使用した例。データベース上で最初のアクター名が使用される。
</figcaption>
</figure>

<figure>
<img src="img/ASP_SaveTitle/3.png" />
<figcaption>
<code>\V[1]</code>制御文字を使用した例。
</figcaption>
</figure>

<figure>
<img src="img/ASP_SaveTitle/4.png" />
<figcaption>
<code>SetSaveTitle</code>コマンドを使用した例。
</figcaption>
</figure>
</div>
