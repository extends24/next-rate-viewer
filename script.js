// ===== 検索処理 =====
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
        <td>${p.initialRate}</td>
        <td>
          <button class="graph-button" onclick="viewGraph('${p.id}', '${p.name}')">グラフ</button>
        </td>
      </tr>
    `
    )
    .join("");
}

// ===== グラフ表示処理 =====
let chartInstance = null;

async function viewGraph(playerId, playerName) {
  const modal = document.getElementById("graphModal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  const apiUrl = `https://next-rate.vercel.app/api/rating/public?keyword=${encodeURIComponent(playerName)}`;
  const res = await fetch(apiUrl);
  const players = await res.json();

  const player = players.find(p => p.id === playerId);
  const history = player.history;

  const labels = history.map(h => new Date(h.playedAt).toLocaleDateString("ja-JP"));
  const data = history.map(h => h.rate);

  const canvas = document.getElementById("rateChart");
  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `${playerName} のレート推移`,
        data,
        borderColor: "blue",
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


// ===== モーダルを閉じる =====
function closeModal() {
  const modal = document.getElementById("graphModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  const canvas = document.getElementById("rateChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}