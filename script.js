const PARTIES = [
    {id: "LIB", label: "Liberal", colour: "#D71920"},
    {id: "CON", label: "Conservative", colour: "#1D4881"},
    {id: "BQ", label: "Bloc Québécois", colour: "#87CEFA"},
    {id: "NDP", label: "NDP", colour: "#F58220"},
    {id: "GRN", label: "Green", colour: "#20A242"},
  ];
  
  

  let score = 0, total = 0, streak = 0, best = 0, answered = false;

  const ADVANCE_DELAY_MS = 1500;
  let advanceTimer = null;

  let photoList = null;
  let deck = [];
  let lastPhoto = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function getRandomPhoto() {
    if (!photoList) {
      const res = await fetch('data/photos.json');
      photoList = await res.json();
    }
    if (deck.length === 0) {
      deck = shuffle(photoList);
      const lastIdx = deck.length - 1;
      if (deck.length > 1 && deck[lastIdx] === lastPhoto) {
        const swapIdx = Math.floor(Math.random() * lastIdx);
        [deck[lastIdx], deck[swapIdx]] = [deck[swapIdx], deck[lastIdx]];
      }
    }
    lastPhoto = deck.pop();
    return 'data/' + lastPhoto;
  }

  function findParty(filename) {
    const party = PARTIES.find(party => filename.includes(party.id));
    return party ? party.id : "ERROR";
  }


  async function next() {
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }

    const p = await getRandomPhoto();
    window.answer = findParty(p);
    answered = false;

    document.getElementById("photo").src = p;
    const feedback = document.getElementById("feedback");
    feedback.textContent = "";
    feedback.classList.remove("correct", "wrong");

    const grid = document.getElementById("party-grid");
    grid.innerHTML = "";
    PARTIES.forEach(party => {
      const btn = document.createElement("button");
      btn.className = "party-btn";
      btn.textContent = party.label;
      btn.style.background = party.colour
      btn.onclick = () => guess(party.id, btn);
      grid.appendChild(btn);
    });
  }
  
  function guess(partyId, btn) {
    if (answered) return;
    answered = true;
    total++;
  
    const correct = partyId === window.answer;
    document.querySelectorAll(".party-btn").forEach(b => {
      const pid = PARTIES.find(p => p.label === b.textContent)?.id;
      if (pid === window.answer) b.classList.add("correct");
      else if (b === btn && !correct) b.classList.add("wrong");
      b.disabled = true;
    });

    const feedback = document.getElementById("feedback");
    if (correct) {
      score++;
      streak++;
      if (streak > best) best = streak;
      feedback.textContent = "Correct!";
      feedback.classList.add("correct");
    } else {
      streak = 0;
      const label = PARTIES.find(p => p.id === window.answer)?.label;
      feedback.textContent = `Incorrect. Answer: ${label}`;
      feedback.classList.add("wrong");
    }
  
    document.getElementById("score").textContent = `${score} / ${total}`;
    document.getElementById("streak").textContent = streak;
    document.getElementById("best").textContent = best;

    advanceTimer = setTimeout(next, ADVANCE_DELAY_MS);
  }
  
  function reset() {
    score = 0; total = 0; streak = 0; best = 0;
    document.getElementById("score").textContent = "0 / 0";
    document.getElementById("streak").textContent = "0";
    document.getElementById("best").textContent = "0";
    next();
  }
  
  next();