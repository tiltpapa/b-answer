---
marp: true
style: |
  section {
    width: 1280px;
    height: 720px;
    background: linear-gradient(#2cb6ff, #0094ff);
    font-family: 'LINE Seed JP', 'ヒラギノ角ゴシック', Meiryo, "MS Gothic", sans-serif;
  }
  /* ── 見かけ幅 60%（h1 + ::after） ── */
  h1 {
    /* 60% から 丸サイズ(96px) と 隙間(12px) を引いた実幅 */
    width: calc(60% - 3.5em);
    margin: 24px auto;
    /* 見かけの中央を合わせるため、(丸+隙間)/2 だけ左へ補正 */
    transform: translateX(-1.75em); /* -(96+12)/2 */
    position: relative;
    min-height: 2em;                 /* h1 背景の縦を “丸サイズ” に固定 */
    display: flex; align-items: center;
    padding: .5em 1em .5em 3em;
    border-radius: 12px;
    background: linear-gradient(#fff,#dfefff);
    color:#003366; font-size: 1.6em;
    box-shadow: 0 4px 8px rgba(0,0,0,.3);
  }
  h1::before{
    content:"Q";
    position: absolute; left:.6em; top: 50%;
    transform: translateY(-50%);
    font-weight: 700; font-size: 1.3em; color:#00cc66;
  }
  /* タイマー */
  @keyframes countdown {
    to {
        transform: translateY(-10em);
    }
  }
  h1::after{
    content: '10';
    position: absolute;
    left: calc(100% + .5em); /* 隙間 */
    top: 0; height: 2em; width: 2em;
    display: flex; align-items: center; justify-content: center;
    border: 3px solid #000; border-radius: 50%;
    color:#fff; font-weight: 700; font-size: 1.5em; text-shadow: 0 -1px 1px rgba(0,0,0,.3);
    background:
      radial-gradient(circle at 30% 30%, #ffffff80, #0000 60%),
      linear-gradient(145deg, #f7a98a, #d94f2a);
    background-attachment: scroll;
    box-shadow:
      inset 0 2px 3px rgba(255,255,255,.5),
      inset 0 -3px 6px rgba(0,0,0,.35),
      0 2px 4px rgba(0,0,0,.4);
  }

  /* ── 選択肢 ── */
  ul {
    display: flex; flex-direction: column;
    justify-content: space-evenly;   /* 縦を均等配分 */
    counter-reset: item;
  }
  li {
    list-style: none; display: flex; align-items: center;
    padding: .3em .5em; width: 75%;
    transform: translateX(10%);
    color: #fff; font-size: 1.3em;
    background: linear-gradient(#001a66, #0b2a70);
    border: 4px ridge #000; border-radius: 1em;
    box-shadow: inset 0 1px 3px rgba(255,255,255,.2), 0 3px 6px rgba(0,0,0,.4);
    counter-increment: item;
  }
  li::before{
    content: counter(item);
    display: inline-flex; align-items: center; justify-content: center;
    width: 1.8em; height: 1.8em; margin-right:.6em;
    border-radius: 50%; font-weight: 700; color:#fff;
    text-shadow: 0 -1px 1px rgba(0,0,0,.3);
    box-shadow: inset 0 2px 3px rgba(255,255,255,.4),
                inset 0 -2px 5px rgba(0,0,0,.35),
                0 1px 2px rgba(0,0,0,.4);
  }

  li:nth-child(1)::before { background: #3498db; } /* 青 */
  li:nth-child(2)::before { background: #e74c3c; } /* 赤 */
  li:nth-child(3)::before { background: #2ecc71; } /* 緑 */
  li:nth-child(4)::before { background: #f1c40f; } /* 黄 */
---

# Which do you like ?

1. Banana
2. Apple
3. Orange
4. Pop corn
