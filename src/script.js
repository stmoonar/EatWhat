var audio = document.getElementById("myAudio");

function toggleAudio() {
  if (audio.paused) {
    audio.play();
    playButton.classList.remove("play-icon");
    playButton.classList.add("pause-icon");
  } else {
    audio.pause();
    playButton.classList.remove("pause-icon");
    playButton.classList.add("play-icon");
  }
}

const initialFoods = [
  "鱼粉",
  "肠粉",
  "烤鸭饭",
  "木耳肉丝米线",
  "辣椒炒肉米线",
  "排骨扁粉",
  "平价大餐",
  "麻辣烫",
  "凉皮",
  "卤",
  "螺狮粉",
  "蒸菜",
  "自助餐",
  "饺子",
  "黄焖鸡米饭",
  "酸辣粉",
  "火腿蛋炒饭",
  "猪油拌粉",
  "馄饨",
  "炸串",
  "火腿蛋炒粉",
];
let foods = new URLSearchParams(window.location.search).get("m")
  ? decompressMenu(new URLSearchParams(window.location.search).get("m")) ||
    initialFoods
  : JSON.parse(localStorage.getItem("foods")) || initialFoods;
const foodList = document.getElementById("food-list");
const dogImage = document.getElementById("dogImage");
const chosenFood = document.getElementById("chosen-food");

function preloadAssets() {
  const assets = [
    { type: "image", url: "assets/a1.gif" },
    { type: "image", url: "assets/a2.gif" },
    { type: "image", url: "assets/a3.gif" },
    { type: "image", url: "assets/zs.png" },
    { type: "audio", url: "assets/b1.mp3" },
  ];

  return Promise.all(
    assets.map((asset) => {
      return new Promise((resolve, reject) => {
        if (asset.type === "image") {
          const img = new Image();
          img.onload = () => resolve(asset.url);
          img.onerror = () => reject(new Error(`Failed to load ${asset.url}`));
          img.src = asset.url;
        } else if (asset.type === "audio") {
          const audio = new Audio();
          audio.oncanplaythrough = () => resolve(asset.url);
          audio.onerror = () =>
            reject(new Error(`Failed to load ${asset.url}`));
          audio.src = asset.url;
        }
      });
    })
  );
}

document.addEventListener("DOMContentLoaded", () => {
  preloadAssets()
    .then(() => console.log("所有资源加载完成"))
    .catch((error) => console.error("资源加载失败:", error));

  foods.forEach((food) => addFoodToList(food));
});

function addFood() {
  const newFoodInput = document.getElementById("new-food");
  const foodName = newFoodInput.value.trim();
  if (foodName) {
    foods.push(foodName);
    addFoodToList(foodName);
    saveFoods();
    newFoodInput.value = "";
  } else {
    showToast("输入不能为空！");
  }
}

function addFoodToList(food) {
  const li = document.createElement("li");
  li.className = "food-item";

  const foodText = document.createElement("span");
  foodText.className = "food-text";
  foodText.textContent = food;

  const deleteButton = document.createElement("button");
  deleteButton.className = "icon-button";
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.onclick = () => {
    foods = foods.filter((f) => f !== food);
    foodList.removeChild(li);
    saveFoods();
  };

  li.appendChild(foodText);
  li.appendChild(deleteButton);
  foodList.appendChild(li);
}

function saveFoods() {
  localStorage.setItem("foods", JSON.stringify(foods));
}

function createConfetti() {
  const symbols = ["♥", "★", "♡", "☆"]; // 使用爱心和星星符号
  const colors = ["#ff69b4", "#ff1493", "#ffb6c1", "#ffc0cb"]; // 粉色系配色

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // 随机选择符号和颜色
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];

    confetti.innerHTML = symbol;
    confetti.style.color = color;

    // 随机生成运动轨迹
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 100 + 50;
    confetti.style.setProperty("--x", `${Math.cos(angle) * radius}px`);
    confetti.style.setProperty("--y", `${Math.sin(angle) * radius}px`);

    // 随机大小
    confetti.style.fontSize = `${Math.random() * 10 + 15}px`;

    confetti.style.left = `${chosenFood.clientWidth / 2}px`;
    confetti.style.top = `${chosenFood.clientHeight / 2}px`;

    // 随机机动画持续时间
    const duration = Math.random() * 0.5 + 1;
    confetti.style.animation = `confetti-explosion ${duration}s ease-out forwards`;

    chosenFood.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

function start() {
  if (dogImage.src.includes("assets/a2.gif")) return;

  chosenFood.style.display = "none";
  dogImage.src = "assets/a2.gif";

  let interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * foods.length);
    chosenFood.textContent = "正在选择: " + foods[randomIndex];
    chosenFood.style.display = "block";
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    const randomIndex = Math.floor(Math.random() * foods.length);
    const winner = foods[randomIndex];
    chosenFood.innerHTML = "今天吃: " + winner;
    dogImage.src = "assets/a3.gif";
    createConfetti();
  }, 3000);
}

const coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

function toggleFoodList() {
  const content = document.querySelector(".content");
  const appreciationCode = document.getElementById("appreciation-code");

  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
    appreciationCode.style.display = "none"; // 确保赞赏码关闭
  }
}

function showAppreciationCode() {
  const appreciationCode = document.getElementById("appreciation-code");
  const content = document.querySelector(".content");

  if (appreciationCode.style.display === "block") {
    appreciationCode.style.display = "none";
  } else {
    appreciationCode.style.display = "block";
    content.style.display = "none"; // 确保菜单关闭
    // 跳转到赞赏码位置，不使用锚点是为了避免 URL 变化
    window.scrollTo({
      top: appreciationCode.offsetTop,
      behavior: "smooth",
    });
  }
}

function compressMenu(foods) {
  return LZString.compressToEncodedURIComponent(foods.join(","));
}

function decompressMenu(compressed) {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    return decompressed ? decompressed.split(",") : null;
  } catch (error) {
    console.error("解压菜单失败:", error);
    return null;
  }
}

function shareMenu() {
  const compressed = compressMenu(foods);
  const shareUrl = `${window.location.origin}${window.location.pathname}?m=${compressed}`;

  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      showToast("分享链接已复制！");
    })
    .catch((err) => {
      showToast("复制链接失败，请手动复制");
    });
}

function loadSharedMenu() {
  const urlParams = new URLSearchParams(window.location.search);
  const compressed = urlParams.get("m");

  if (compressed) {
    const decodedFoods = decompressMenu(compressed);
    if (decodedFoods) {
      foods = decodedFoods;
      foodList.innerHTML = "";
      foods.forEach((food) => addFoodToList(food));
      // showToast('已加载分享的菜单！');
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSharedMenu();
});

function showToast(message, duration = 2000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function showDialog() {
  document.getElementById("confirmDialog").style.display = "flex";
}

function closeDialog() {
  document.getElementById("confirmDialog").style.display = "none";
}

function confirmReset() {
  foods = [...initialFoods];
  foodList.innerHTML = "";
  foods.forEach((food) => addFoodToList(food));
  saveFoods();
  showToast("已恢复默认菜单");
  closeDialog();
}

function showClearDialog() {
  document.getElementById("clearDialog").style.display = "flex";
}

function closeClearDialog() {
  document.getElementById("clearDialog").style.display = "none";
}

function confirmClear() {
  foods = [];
  foodList.innerHTML = "";
  saveFoods();
  showToast("已清空所有菜品");
  closeClearDialog();
}

function showBatchInputDialog() {
  document.getElementById("batchInputDialog").style.display = "flex";
  document.getElementById("batchInput").value = "";
}

function closeBatchInputDialog() {
  document.getElementById("batchInputDialog").style.display = "none";
}

function confirmBatchInput() {
  const input = document.getElementById("batchInput").value;
  const newFoods = input
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (newFoods.length === 0) {
    showToast("请输入有效的菜品");
    return;
  }

  if (foods.length > 0) {
    document.getElementById("batchInputConfirmDialog").style.display = "flex";
    window.tempNewFoods = newFoods;
  } else {
    addNewFoods(newFoods);
    closeBatchInputDialog();
  }
}

function confirmBatchInputWithClear() {
  foods = [];
  foodList.innerHTML = "";
  addNewFoods(window.tempNewFoods);
  closeBatchInputConfirmDialog();
  closeBatchInputDialog();
}

function confirmBatchInputWithoutClear() {
  addNewFoods(window.tempNewFoods);
  closeBatchInputConfirmDialog();
  closeBatchInputDialog();
}

function closeBatchInputConfirmDialog() {
  document.getElementById("batchInputConfirmDialog").style.display = "none";
}

function addNewFoods(newFoods) {
  newFoods.forEach((food) => {
    if (!foods.includes(food)) {
      foods.push(food);
      addFoodToList(food);
    }
  });
  saveFoods();
  showToast(`已添加 ${newFoods.length} 个菜品`);
}
