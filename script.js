async function search() {
  const keyword = document.getElementById("keyword").value.trim();
  const tbody = document.getElementById("rating-body");

  if (!keyword) {
    tbody.innerHTML = `<tr><td colspan="4">検索ワードを入力してください</td></tr>`;
    return;
  }

  const apiUrl = `https://next-rate.vercel.app/api/rating/public?keyword=${encodeURIComponent(keyword)}`;

  const res = await fetch(apiUrl);
  const players = await res.json();

  if (players.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">該当するプレイヤーがいません</td></tr>`;
    return;
  }

  tbody.innerHTML = players
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.currentRate}</td>
        <td>
          <button class="graph-button" onclick="viewGraph('${p.id}')">グラフ</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function viewGraph(playerId) {
  window.location.href = `graph.html?playerId=${playerId}`;
}