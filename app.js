(() => {
    const prefersReducedMotion = () =>
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const randomFrom = (min, max) => Math.random() * (max - min) + min;

    const confettiBurst = (originX, originY) => {
        if (prefersReducedMotion()) return;

        const colors = ['#ff4fa3', '#6b5bff', '#35d1ff', '#ffd24a', '#7dffb2'];
        const count = 26;

        for (let i = 0; i < count; i += 1) {
            const piece = document.createElement('div');
            piece.setAttribute('aria-hidden', 'true');

            const size = Math.round(randomFrom(6, 10));
            piece.style.position = 'fixed';
            piece.style.left = `${originX}px`;
            piece.style.top = `${originY}px`;
            piece.style.width = `${size}px`;
            piece.style.height = `${Math.round(size * 1.2)}px`;
            piece.style.borderRadius = `${Math.round(randomFrom(2, 5))}px`;
            piece.style.background = colors[i % colors.length];
            piece.style.zIndex = '9999';
            piece.style.pointerEvents = 'none';
            piece.style.willChange = 'transform, opacity';

            document.body.appendChild(piece);

            const dx = randomFrom(-160, 160);
            const dy = randomFrom(-240, -120);
            const rotation = randomFrom(-540, 540);
            const duration = randomFrom(650, 1050);

            const animation = piece.animate(
                [
                    { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
                    {
                        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotation}deg)`,
                        opacity: 0,
                    },
                ],
                {
                    duration,
                    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                    fill: 'forwards',
                }
            );

            animation.addEventListener('finish', () => {
                piece.remove();
            });
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const rsvpButton = document.getElementById('rsvpButton');
        if (rsvpButton) {
            rsvpButton.addEventListener('click', (event) => {
                const rect = rsvpButton.getBoundingClientRect();
                const originX = rect.left + rect.width / 2;
                const originY = rect.top + rect.height / 2;
                confettiBurst(originX, originY);

                // Do not prevent navigation; the link should still open the form.
                // Confetti runs instantly and cleans up itself.
                void event;
            });
        }

        // Verification (demo) modal + tic-tac-toe
        const verifyRootEl = document.getElementById('verify');
        if (!(verifyRootEl instanceof HTMLElement)) {
            // If the modal markup isn't present, keep the rest of the page working.
            return;
        }
        const verifyRoot = verifyRootEl;
        const verifyLoading = document.getElementById('verifyLoading');
        const verifyGame = document.getElementById('verifyGame');
        const gridEl = document.getElementById('tttGrid');
        const statusEl = document.getElementById('tttStatus');
        const resetBtn = document.getElementById('tttReset');
        const closeBtn = verifyRoot.querySelector('.verify__close');

        const hasVerifyUi =
            verifyLoading instanceof HTMLElement &&
            verifyGame instanceof HTMLElement &&
            gridEl instanceof HTMLElement &&
            statusEl instanceof HTMLElement &&
            resetBtn instanceof HTMLElement &&
            closeBtn instanceof HTMLElement;
        if (!hasVerifyUi) {
            // Markup mismatch (common after copy/paste to GitHub Pages).
            // Avoid crashing the whole page.
            return;
        }

        let closeVisibility = 0;
        const setCloseVisibility = (value) => {
            closeVisibility = value;
            if (verifyRoot) verifyRoot.style.setProperty('--close-opacity', String(closeVisibility));
            if (closeBtn instanceof HTMLElement)
                closeBtn.style.setProperty('--close-opacity', String(closeVisibility));
        };

        const bumpCloseVisibility = () => {
            // Make the X progressively easier to notice as the user interacts.
            setCloseVisibility(closeVisibility + 0.1);
        };

        let closeSize = 20;
        const setCloseSize = (sizePx) => {
            // Clamp so it doesn't get ridiculous
            closeSize = Math.max(18, Math.min(72, Math.round(sizePx)));

            // Derive button sizing from closeSize
            const padY = Math.round(8 + (closeSize - 20) * 0.12);  // 8..~14
            const padX = Math.round(12 + (closeSize - 20) * 0.22); // 12..~24
            const fontPx = Math.round(14 + (closeSize - 20) * 0.10); // 14..~19

            const applyVars = (el) => {
                el.style.setProperty('--close-pad-y', `${padY}px`);
                el.style.setProperty('--close-pad-x', `${padX}px`);
                el.style.setProperty('--close-font', `${fontPx}px`);
            };

            if (verifyRoot) applyVars(verifyRoot);
            if (closeBtn instanceof HTMLElement) applyVars(closeBtn);
        };

        const bumpCloseSize = () => {
            // Make the X physically larger each time the user restarts.
            setCloseSize(closeSize + 3);
        };

        const flashHmm = () => {
            // Remove any existing flash (in case of rapid clicks)
            document.querySelectorAll('.hmm-flash').forEach((el) => el.remove());

            const flash = document.createElement('div');
            flash.className = 'hmm-flash';
            flash.setAttribute('aria-hidden', 'true');

            const img = document.createElement('img');
            img.className = 'hmm-flash__img';
            img.src = 'hmm.jpg';
            img.alt = '';
            img.decoding = 'async';

            flash.appendChild(img);
            document.body.appendChild(flash);

            const cleanup = () => {
                flash.removeEventListener('animationend', cleanup);
                flash.remove();
            };

            flash.addEventListener('animationend', cleanup);

            // Fallback: if animationend doesn't fire, remove shortly.
            window.setTimeout(() => {
                if (document.body.contains(flash)) flash.remove();
            }, 220);
        };

        const closeVerify = () => {
            if (!verifyRoot) return;
            verifyRoot.hidden = true;
            document.documentElement.style.overflow = '';
        };

        const openVerify = () => {
            verifyRoot.hidden = false;
            document.documentElement.style.overflow = 'hidden';
            setCloseVisibility(0);
            setCloseSize(20);
            verifyLoading.hidden = false;
            verifyLoading.style.display = 'flex';
            verifyGame.hidden = true;
            verifyGame.style.display = 'none';

            window.setTimeout(() => {
                verifyLoading.hidden = true;
                verifyLoading.style.display = 'none';
                verifyGame.hidden = false;
                verifyGame.style.display = 'block';
            }, prefersReducedMotion() ? 0 : 1200);
        };

        if (verifyRoot) {
            verifyRoot.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement)) return;
                if (target.getAttribute('data-verify-close') === 'true') {
                    closeVerify();
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeVerify();
        });

        const X = 'X';
        const O = 'O';

        /** @type {(string | null)[]} */
        let board = Array(9).fill(null);
        let gameOver = false;
        let isAiTurn = false;

        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        const winnerOf = (b) => {
            for (const [a, c, d] of lines) {
                if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
            }
            return null;
        };

        const isFull = (b) => b.every((v) => v);

        const setStatus = (text) => {
            if (!statusEl) return;
            statusEl.textContent = text;
        };

        const render = () => {
            if (!gridEl) return;
            gridEl.innerHTML = '';

            for (let i = 0; i < 9; i += 1) {
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.className = 'ttt__cell';
                const v = board[i];
                cell.textContent = v ?? '';
                if (v) cell.setAttribute('data-v', v);
                cell.disabled = Boolean(v) || gameOver || isAiTurn;
                cell.setAttribute('aria-label', `Celula ${i + 1}`);

                cell.addEventListener('click', () => {
                    if (gameOver || isAiTurn) return;
                    if (board[i]) return;
                    board[i] = O;
                    step();
                });

                gridEl.appendChild(cell);
            }
        };

        const scorePosition = (b, depth) => {
            const w = winnerOf(b);
            if (w === X) return 10 - depth;
            if (w === O) return depth - 10;
            if (isFull(b)) return 0;
            return null;
        };

        const minimax = (b, depth, maximizing) => {
            const terminalScore = scorePosition(b, depth);
            if (terminalScore !== null) return { score: terminalScore, move: -1 };

            if (maximizing) {
                let best = { score: -Infinity, move: -1 };
                for (let i = 0; i < 9; i += 1) {
                    if (b[i]) continue;
                    b[i] = X;
                    const result = minimax(b, depth + 1, false);
                    b[i] = null;
                    if (result.score > best.score) best = { score: result.score, move: i };
                }
                return best;
            }

            let best = { score: Infinity, move: -1 };
            for (let i = 0; i < 9; i += 1) {
                if (b[i]) continue;
                b[i] = O;
                const result = minimax(b, depth + 1, true);
                b[i] = null;
                if (result.score < best.score) best = { score: result.score, move: i };
            }
            return best;
        };

        const aiMove = () => {
            if (gameOver) return;
            isAiTurn = true;
            render();

            const doMove = () => {
                const { move } = minimax([...board], 0, true);
                if (move >= 0 && !board[move]) board[move] = X;
                isAiTurn = false;
                step();
            };

            window.setTimeout(doMove, prefersReducedMotion() ? 0 : 220);
        };

        const step = () => {
            const w = winnerOf(board);
            if (w) {
                gameOver = true;
                setStatus(w === X ? 'X a câștigat.' : 'O a câștigat.');
                render();
                return;
            }
            if (isFull(board)) {
                gameOver = true;
                setStatus('Remiză.');
                render();
                return;
            }

            // If it's X's turn (AI), move.
            const xCount = board.filter((v) => v === X).length;
            const oCount = board.filter((v) => v === O).length;
            if (xCount === oCount) {
                setStatus('Rândul lui X…');
                render();
                aiMove();
                return;
            }

            setStatus('Rândul tău: pune O.');
            render();
        };

        const resetGame = () => {
            board = Array(9).fill(null);
            gameOver = false;
            isAiTurn = false;

            // X always starts in the center.
            board[4] = X;
            setStatus('Rândul tău: pune O.');
            render();
        };

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                flashHmm();
                bumpCloseVisibility();
                bumpCloseSize();
                resetGame();
            });
        }

        // Init
        resetGame();
        openVerify();
    });
})();