import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { CustomIronSession } from '../../utils/types';
import sessionOptions from '../../utils/sessionOptions';

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { USER_PASSWORD } = process.env;
  const { password } = JSON.parse(req.body);

  console.log(USER_PASSWORD);
  console.log(password);

  if (password === USER_PASSWORD) {
    console.log('success');

    (req.session as CustomIronSession).user = { isLoggedIn: true };

    await req.session.save();

    return res.send({ ok: true });
  }

  console.log('failed');

  res.status(401).send('Wrong Password');
}
