"use client";
export const runtime = 'edge';
import { debounce } from 'es-toolkit';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCharacterField, updateCharacter, usePageGuard } from '@/lib/character';
import { selectedCharacterIdAtom } from '@/store/action';
import { useTranslations } from 'next-intl';

function page() {
    usePageGuard();
  return (
    <>
      <Creator_Notes />
    </>
  );
}

export default page;

function Creator_Notes() {
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [inputValue, setInputValue] = useState<string>("");
  const t = useTranslations()
  const handleChangeText = debounce(async (value: string) => {
    await updateCharacter(cid as number, "data.creator_notes" as string, value);
  }, 1000);

  useEffect(() => {
    const fetchDefaultValue = async () => {
      try {
        const rows = await getCharacterField(cid as number, "data.creator_notes");
        if (rows && typeof rows === "string") {
          setInputValue(rows);
        }
      } catch (error) {
        console.error("Failed to fetch default value:", error);
      }
    };
    fetchDefaultValue();
  }, [cid]);

  return (
    <>
      {cid ? (
        <div className="flex flex-col h-full overflow-hidden p-0.5">
          <Label htmlFor="message">{t("Character.creator_notes")}</Label>
          <Textarea
            className="flex-1 mt-4 resize-none overflow-auto"
            placeholder={t("type messages")}
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);
              handleChangeText(value);
            }}
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
