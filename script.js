// ===== 検索処理 =====
async function search() {
  const keyword = document.getElementById("keyword").value.trim();
  const tbody = document.getElementById("rating-body");

  if (!keyword) {
    tbody.innerHTML = `<tr><td colspan="2">検索ワードを入力してください</td></tr>`;
    return;
  }

  const apiUrl = `https://next-rate.vercel.app/api/rating/public?keyword=${encodeURIComponent(keyword)}`;
  const res = await fetch(apiUrl);
  const players = await res.json();

  if (!Array.isArray(players) || players.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2">該当するプレイヤーがいません</td></tr>`;
    return;
  }

  let rowsHtml = "";

  players.forEach((p) => {
    const history = Array.isArray(p.history) ? p.history : [];

    if (history.length === 0) {
      // 履歴が無い場合は1行だけ出す
      rowsHtml += `
        <tr>
          <td>${p.name}</td>
          <td>対局履歴なし</td>
        </tr>
      `;
      return;
    }

    history.forEach((h, index) => {
      const nameCell = index === 0 ? p.name : "";
      rowsHtml += `
        <tr>
          <td>${nameCell}</td>
          <td>${h.rate}</td>
        </tr>
      `;
    });
  });

  tbody.innerHTML = rowsHtml;
}