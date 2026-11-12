'use strict';
/* Activity "money" — Count coins and make change */

register('money', 'math', {
  icon: '🪙', title: 'Money', desc: 'Count coins and make change', color: '#16a34a', bg: '#e3f8ea',
  gen(lv) {
    const coinSet = lv === 1 ? [1, 5, 10] : [1, 5, 10, 25];
    if (lv === 3 && Math.random() < .5) {
      const price = rnd(1, 19) * 5, ans = 100 - price, item = pick([['🍦', 'an ice cream'], ['🍪', 'a cookie'], ['🧃', 'a juice box'], ['✏️', 'a pencil'], ['🎈', 'a balloon'], ['🍎', 'an apple']]);
      return { key: 'ch' + price, kind: 'number', answer: ans, post: '¢', prompt: `<span class="emo" style="font-size:3.5rem">${item[0]}</span><div class="wp">You buy ${item[1]} for <b>${price}¢</b>. You pay with <b>$1</b> (100¢). How much <b>change</b> do you get?</div>`,
        say: `You buy ${item[1]} for ${price} cents. You pay with one dollar. How much change do you get?`, hint: `Count up from ${price}¢ to 100¢.`,
        visual(v) {
          let cur = price; const steps = [], used = [];
          while (cur < 100) { const c = [25, 10, 5, 1].find(c => cur + c <= 100 && (c !== 25 || cur % 25 === 0) && (c !== 10 || cur % 10 === 0)) || [5, 1].find(c => cur + c <= 100); cur += c; used.push(c); steps.push(`${coinHTML(c)} → <b>${cur}¢</b>`); }
          v.innerHTML = barModel([{ label: '$1', parts: [{ v: price, color: '#a3a3a3', text: `${price}¢ item` }, { v: ans, color: '#16a34a', text: `${ans}¢ change` }] }]) +
            `<div class="cap" style="margin-top:14px">Count up from ${price}¢:</div><div class="counton" style="margin-top:6px">${steps.map(s => `<div>${s}</div>`).join('')}</div><div class="cap">Change = ${used.map(c => c + '¢').join(' + ')} = <b>${ans}¢</b></div>`;
        } };
    }
    let list, total, guard = 0;
    do {
      const n = lv === 1 ? rnd(2, 5) : rnd(3, 6);
      list = Array.from({ length: n }, () => pick(coinSet));
      if (lv === 3) list.unshift(100);
      total = list.reduce((s, v) => s + v, 0);
    } while (guard++ < 40 && (lv === 1 ? total > 50 : lv === 2 ? total > 100 : total > 200));
    list = shuffle(list);
    return { key: 'm' + list.join(','), kind: 'number', answer: total, post: '¢', prompt: `How much money is this?${coinsHTML(list)}`, say: 'How many cents is this?',
      hint: 'Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢. Start with the biggest!',
      visual(v) { v.innerHTML = countOnHTML(list) + (total >= 100 ? `<div class="cap">${total}¢ is the same as <b>$${(total / 100).toFixed(2)}</b></div>` : ''); } };
  }
});
