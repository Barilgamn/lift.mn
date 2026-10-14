import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Link2, Plus, Unlink } from 'lucide-react';
import { useCrm } from '../../../store/crmStore';
import { useAdminStore } from '../../../store/adminStore';
import { companyNameFromDetails, phoneKey } from '../../../lib/crm';
import type { Submission } from '../../../types';
import { AdminModal } from '../adminUi';
import { CompanyForm, CompanyPicker, KindBadge, btnGhost } from './crmUi';

/** Хүсэлтийн дэлгэрэнгүй дээр — CRM-ийн харилцагчтай холбох */
export const CrmLinkPanel: React.FC<{ submission: Submission; onLinked: (companyId: string | null) => void }> = ({
  submission, onLinked,
}) => {
  const { companies, contacts, notInstalled, addActivity } = useCrm();
  const { linkSubmissionCompany } = useAdminStore();
  const [picking, setPicking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const linked = companies.find((c) => c.id === submission.companyId);

  /** Утас таарсан харилцагч — нэг товшилтоор холбоно */
  const guess = useMemo(() => {
    if (submission.companyId) return undefined;
    const key = phoneKey(submission.phone);
    if (key.length < 6) return undefined;
    const byContact = contacts.find((p) => p.companyId && phoneKey(p.phone) === key);
    return companies.find((c) => c.id === byContact?.companyId || phoneKey(c.phone) === key);
  }, [submission, companies, contacts]);

  if (notInstalled) return null;

  const link = async (companyId: string | null) => {
    const err = await linkSubmissionCompany(submission.id, companyId);
    if (err) { setError(err); return; }
    setError('');
    setPicking(false);
    onLinked(companyId);
    if (companyId) void addActivity({ companyId, kind: 'system', body: `Хүсэлт холбогдлоо: ${submission.id} — ${submission.summary}` });
  };

  const seedName = companyNameFromDetails(submission.details) || submission.contactName;

  return (
    <div className="mt-5 pt-4 border-t border-line-light" id="crm-link">
      <div className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-2 flex items-center gap-1.5">
        <Building2 className="w-3.5 h-3.5" /> CRM харилцагч
      </div>
      {linked ? (
        <div className="flex items-center gap-2 p-2.5 rounded-lg border border-line-light">
          <KindBadge kind={linked.kind} />
          <Link to={`/admin/crm/c/${linked.id}`} className="text-sm font-bold text-brand hover:underline truncate">{linked.name}</Link>
          <button type="button" onClick={() => void link(null)} className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-ink-dark-muted hover:text-red-700 cursor-pointer">
            <Unlink className="w-3.5 h-3.5" /> Салгах
          </button>
        </div>
      ) : picking ? (
        <div className="space-y-2">
          <CompanyPicker value={null} onChange={(id) => id && void link(id)} />
          <button type="button" onClick={() => setPicking(false)} className="text-xs font-bold text-ink-dark-muted hover:text-brand cursor-pointer">Болих</button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {guess && (
            <button type="button" onClick={() => void link(guess.id)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-sky-50 border border-sky-200 text-brand text-xs font-bold cursor-pointer hover:border-brand" id="crm-guess">
              <Link2 className="w-3.5 h-3.5" /> {guess.name}-тэй холбох
            </button>
          )}
          <button type="button" onClick={() => setPicking(true)} className={btnGhost} id="crm-pick"><Link2 className="w-3.5 h-3.5" /> Харилцагч сонгох</button>
          <button type="button" onClick={() => setCreating(true)} className={btnGhost} id="crm-create"><Plus className="w-3.5 h-3.5" /> Шинэ харилцагч</button>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}

      {creating && (
        <AdminModal title="Шинэ харилцагч" onClose={() => setCreating(false)} wide>
          <CompanyForm
            initial={{ name: seedName, phone: '', kind: /сөх/i.test(seedName) ? 'soh' : 'company' }}
            contactSeed={{ name: submission.contactName, phone: submission.phone }}
            onDone={(id) => { setCreating(false); if (id) void link(id); }}
          />
        </AdminModal>
      )}
    </div>
  );
};

export default CrmLinkPanel;
