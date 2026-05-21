import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick } from '../utils/random';

const QUESTIONS = ['What is your purpose?', 'Describe your lore.', 'Rate this interaction.'];
const NPC_REPLIES = ['I am functioning normally.', 'Processing social cue...', 'Affirmative. Beep.'];
const HIDDEN = ['Gain Self-Awareness', 'Question Reality', 'Download Feelings'];

export function NPCBreakout(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [alert, setAlert] = useState(0);
  const [aware, setAware] = useState(0);
  const [q, setQ] = useState(QUESTIONS[0]);

  useEffect(() => {
    trackInterval(() => setQ(pick(QUESTIONS)), 3500);
    if (aware >= 100) props.onGameEnd(props.player2.id);
    if (alert >= 100) props.onGameEnd(props.player1.id);
    return purge;
  }, [aware, alert]);

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <p className="mb-2 font-black">MAIN CHARACTER</p>
          <p className="mb-2 border-2 border-black bg-black/50 p-2 text-sm">{q}</p>
          <Meter label="Alert Meter" value={alert} max={100} color="#ff10f0" />
          <NeonButton
            variant="yellow"
            className="w-full"
            onClick={() => {
              props.sendAction({ type: 'interrogate', payload: { q } });
              setAlert((a) => a + 8);
            }}
          >
            Interrogate
          </NeonButton>
        </div>
      )}
      renderP2={() => (
        <div>
          <p className="mb-2 font-black text-neon-purple">NPC (blend in)</p>
          <div className="mb-2 flex flex-wrap gap-1">
            {NPC_REPLIES.map((r) => (
              <NeonButton
                key={r}
                variant="purple"
                className="text-[10px]"
                onClick={() => {
                  setAlert((a) => Math.max(0, a - 5));
                  props.sendAction({ type: 'reply', payload: { r } });
                }}
              >
                {r}
              </NeonButton>
            ))}
          </div>
          <Meter label="Self-Awareness (secret)" value={aware} max={100} color="#00f5ff" />
          <div className="mt-2 flex flex-wrap gap-1 opacity-80">
            {HIDDEN.map((h) => (
              <button
                key={h}
                type="button"
                className="border border-dashed border-neon-cyan px-1 text-[9px] text-neon-cyan"
                onClick={() => {
                  setAware((w) => w + 15);
                  setAlert((a) => a + 12);
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}
    />
  );
}
