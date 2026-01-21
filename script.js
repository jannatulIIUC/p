const container = document.getElementById("array-container");
const sizeInput = document.getElementById("size");
const sizeNumber = document.getElementById("size-number");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speed-value");
const generateBtn = document.getElementById("generate");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const algoSelect = document.getElementById("algorithm");

let array = [];
let delay = 100;
let stopSorting = false;

/* ---------- Utils ---------- */
function randomArray(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
}

function createBars(arr) {
  container.innerHTML = "";
  const maxVal = Math.max(...arr);
  const w = container.clientWidth;

  arr.forEach(val => {
    const bar = document.createElement("div");
    bar.style.height = `${(val / maxVal) * 100}%`;
    bar.style.width = `${Math.floor(w / arr.length) - 2}px`;
    bar.className = "bg-blue-500 rounded-t transition-all duration-150 relative";
    bar.title = val; // show actual value on hover
    container.appendChild(bar);
  });
}

function updateBars(arr, highlight = []) {
  const bars = container.children;
  const maxVal = Math.max(...arr);

  for (let i = 0; i < arr.length; i++) {
    bars[i].style.height = `${(arr[i] / maxVal) * 100}%`;
    bars[i].className =
      "rounded-t transition-all duration-150 relative " +
      (highlight.includes(i) ? "bg-red-500" : "bg-blue-500");
    bars[i].title = arr[i]; // update value on hover dynamically
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function calculateDelay() {
  return Math.max(10, 400 - array.length * 2 - parseInt(speedInput.value));
}



// Typing animation
  const lines = [
    { text: "Rising elements to top — Bubble Sort", color: "text-pink-300" },
  { text: "Stepwise organization — Insertion Sort", color: "text-emerald-300" },
  { text: "Pick, place, repeat — Selection Sort", color: "text-indigo-300" },
  { text: "Divide, merge, conquer — Merge Sort", color: "text-orange-300" },
  { text: "Partition and order — Quick Sort", color: "text-purple-300" },
  { text: "Heap structured sorting — Heap Sort", color: "text-cyan-300" }
  ];
  let i = 0;
  (function type() {
    const { text, color } = lines[i];
    const el = document.getElementById("typing-line");
    el.className = color;
    let j = 0;
    (function typingChar() {
      if (j < text.length) {
        el.textContent += text[j++];
        setTimeout(typingChar, 50);
      } else {
        setTimeout(() => {
          el.textContent = "";
          i = (i + 1) % lines.length;
          type();
        }, 1500);
      }
    })();
  })();



/* ---------- Sorting Algorithms ---------- */

async function bubbleSort() {
  stopSorting = false;
  delay = calculateDelay();

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (stopSorting) return;
      updateBars(array, [j, j + 1]);
      await sleep(delay);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateBars(array, [j, j + 1]);
        await sleep(delay);
      }
    }
  }
  updateBars(array);
}

async function selectionSort() {
  stopSorting = false;
  delay = calculateDelay();

  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      if (stopSorting) return;
      updateBars(array, [min, j]);
      await sleep(delay);
      if (array[j] < array[min]) min = j;
    }
    [array[i], array[min]] = [array[min], array[i]];
    updateBars(array, [i, min]);
    await sleep(delay);
  }
  updateBars(array);
}

async function insertionSort() {
  stopSorting = false;
  delay = calculateDelay();

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      if (stopSorting) return;
      array[j + 1] = array[j];
      updateBars(array, [j, j + 1]);
      await sleep(delay);
      j--;
    }
    array[j + 1] = key;
    updateBars(array, [j + 1]);
    await sleep(delay);
  }
  updateBars(array);
}

async function quickSortHelper(start, end) {
  if (stopSorting) return;
  if (start >= end) return;

  let pivot = array[end];
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (stopSorting) return;
    updateBars(array, [j, end]);
    await sleep(delay);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      updateBars(array, [i, j]);
      await sleep(delay);
    }
  }
  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  updateBars(array, [i + 1, end]);
  await sleep(delay);

  await quickSortHelper(start, i);
  await quickSortHelper(i + 2, end);
}

async function quickSort() {
  stopSorting = false;
  delay = calculateDelay();
  await quickSortHelper(0, array.length - 1);
  updateBars(array);
}

async function mergeSortHelper(start, end) {
  if (stopSorting) return;
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);
  await mergeSortHelper(start, mid);
  await mergeSortHelper(mid + 1, end);

  // Merge
  let temp = [];
  let i = start, j = mid + 1;
  while (i <= mid && j <= end) {
    if (stopSorting) return;
    updateBars(array, [i, j]);
    await sleep(delay);
    if (array[i] <= array[j]) {
      temp.push(array[i++]);
    } else {
      temp.push(array[j++]);
    }
  }
  while (i <= mid) temp.push(array[i++]);
  while (j <= end) temp.push(array[j++]);

  for (let k = start; k <= end; k++) {
    array[k] = temp[k - start];
    updateBars(array, [k]);
    await sleep(delay);
  }
}

async function mergeSort() {
  stopSorting = false;
  delay = calculateDelay();
  await mergeSortHelper(0, array.length - 1);
  updateBars(array);
}

async function heapify(n, i) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n && array[l] > array[largest]) largest = l;
  if (r < n && array[r] > array[largest]) largest = r;

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    updateBars(array, [i, largest]);
    await sleep(delay);
    await heapify(n, largest);
  }
}

async function heapSort() {
  stopSorting = false;
  delay = calculateDelay();
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    updateBars(array, [0, i]);
    await sleep(delay);
    await heapify(i, 0);
  }
  updateBars(array);
}

/* ---------- Size Sync ---------- */
function applySize(val) {
  val = parseInt(val);
  if (isNaN(val)) return;
  val = Math.min(100, Math.max(10, val));
  sizeInput.value = val;
  sizeNumber.value = val;
  stopSorting = true;
  array = randomArray(val);
  createBars(array);
}

sizeInput.addEventListener("input", () => applySize(sizeInput.value));
sizeNumber.addEventListener("blur", () => applySize(sizeNumber.value));
sizeNumber.addEventListener("keydown", e => { if (e.key === "Enter") sizeNumber.blur(); });

/* ---------- Other Events ---------- */
generateBtn.onclick = () => applySize(sizeInput.value);
stopBtn.onclick = () => stopSorting = true;

speedInput.oninput = () => {
  speedValue.textContent = speedInput.value;
};

startBtn.onclick = async () => {
  stopSorting = true;
  await sleep(50);
  stopSorting = false;
  delay = calculateDelay();
  switch (algoSelect.value) {
    case "bubble": await bubbleSort(); break;
    case "selection": await selectionSort(); break;
    case "insertion": await insertionSort(); break;
    case "quick": await quickSort(); break;
    case "merge": await mergeSort(); break;
    case "heap": await heapSort(); break;
  }
};

/* ---------- Init ---------- */
speedValue.textContent = speedInput.value;
array = randomArray(sizeInput.value);
createBars(array);







