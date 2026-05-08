const PARTIES = [
    {id: "LIB", label: "Liberal", colour: "#D71920"},
    {id: "CON", label: "Conservative", colour: "#1D4881"},
    {id: "BQ", label: "Bloc Québécois", colour: "#87CEFA"},
    {id: "NDP", label: "NDP", colour: "#F58220"},
    {id: "GRN", label: "Green", colour: "#20A242"},
  ];
  
  

  let score = 0, total = 0, streak = 0, best = 0, answered = false;
  
  async function getRandomPhoto() {
    const res = await fetch('/data/photos.json');
    const list = await res.json();
    return '/photos/' + list[Math.floor(Math.random() * list.length)];
  }

  async function findParty(filename) {
    PARTIES.forEach(party => {
        if (filename.includes(party.id)) return party.id;
    });
    return "ERROR";
  }

  
  function next() {
    const p = getRandomPhoto()
    window.answer = findParty(p);
    answered = false;
  
    document.getElementById("photo").src = p;
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-btn").style.display = "none";
  
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
  
    if (correct) {
      score++;
      streak++;
      if (streak > best) best = streak;
      document.getElementById("feedback").textContent = "Correct!";
    } else {
      streak = 0;
      const label = PARTIES.find(p => p.id === window.answer)?.label;
      document.getElementById("feedback").textContent = `Nope — candidadte ran for ${label}.`;
    }
  
    document.getElementById("score").textContent = `${score} / ${total}`;
    document.getElementById("streak").textContent = streak;
    document.getElementById("best").textContent = best;
    document.getElementById("next-btn").style.display = "inline-block";
  }
  
  function reset() {
    score = 0; total = 0; streak = 0; best = 0;
    document.getElementById("score").textContent = "0 / 0";
    document.getElementById("streak").textContent = "0";
    document.getElementById("best").textContent = "0";
    load();
  }
  
  document.getElementById("next-btn").onclick = next;
  next();