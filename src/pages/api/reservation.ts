// api/reserve.ts

import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

const formatDateTimeForPostgres = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, '0');
  const day = String(dateTime.getDate()).padStart(2, '0');
  const hours = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');

  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  return formattedDateTime;
};

const handler: NextApiHandler = async (req, res) => {
  const supabase = createPagesServerClient({ req, res });

  const user = await supabase.auth.getSession();

  if (user.data.session === null){
    return res.json({ message: 'unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { datesToUpdate, user_email, paket, buktiPembayaran, user_id } = req.body;

    const { data, error } = await supabase.from('ketersediaan').select('*');

    for (const dateToUpdate of datesToUpdate) {
      const availabilityRecord = data?.find((record) => record.tanggal_ketersediaan === dateToUpdate);

      if (availabilityRecord) {
        // Update kapasitas column of the existing row
        await supabase
          .from('ketersediaan')
          .update({ kapasitas: availabilityRecord.kapasitas - 1 })
          .eq('tanggal_ketersediaan', dateToUpdate);
      } else {
        // Insert a new row with values (date, 29)
        await supabase.from('ketersediaan').upsert([
          { tanggal_ketersediaan: dateToUpdate, kapasitas: 29 },
        ]);
      }
    }

    const lastDate = datesToUpdate[datesToUpdate.length - 1];
    const modifiedLastDate = lastDate.replace(/(\d{4}-\d{2}-\d{2}T)\d{2}:\d{2}:\d{2}/, '$123:59:59');
    await supabase
      .from('member')
      .update({ membership_start: datesToUpdate[0], membership_end: modifiedLastDate })
      .eq('email', user_email);

    await supabase
      .from('transaksi')
      .insert({ id_user: user_id, id_paket: paket, bukti_pembayaran: buktiPembayaran });

    // if (transaksiError) {
    //   console.error(transaksiError);
    // }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
