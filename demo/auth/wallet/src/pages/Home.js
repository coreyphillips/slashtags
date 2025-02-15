// @ts-nocheck
import { Template } from '../containers/Template';
import { Card } from '../components/Card';
import { ArrowSVG } from '../components/ArrowSVG';
import { useContext } from 'react';
import { StoreContext, types } from '../store';
import { Article } from '../components/Article';

export const Home = () => {
  const { store, dispatch } = useContext(StoreContext);

  const accounts = Object.values(store.accounts).reduce((acc, service) => {
    acc.push({
      service: Object.values(service)[0].service,
      profiles: Object.values(service),
    });
    return acc;
  }, []);

  const isNew = accounts?.length === 0 || store.contacts?.length === 0;

  return (
    <Template title={'Wallet'}>
      <div className="home">
        {isNew ? (
          <>
            <ArrowSVG />
            <p className="get-started">
              Click the scan button to add new <span> account </span>
              or <span>contact</span>
            </p>
          </>
        ) : (
          <>
            {accounts?.length > 0 && (
              <Article
                title="Accounts"
                onClick={() =>
                  dispatch({ type: types.SET_VIEW, view: 'scanQR' })
                }
              >
                {accounts.map((account) => (
                  <>
                    <Card
                      key={account.service.publicKey}
                      className="account-title"
                      publicKey={account.service.publicKey}
                      metadata={account.service.metadata}
                    />
                    {account.profiles.map((p) => (
                      <Card
                        key={p.publicKey}
                        className="account-subprofile"
                        publicKey={p.profile.publicKey}
                        metadata={p.profile.metadata}
                        onClick={() =>
                          dispatch({
                            type: types.SET_ACCOUNT,
                            account: p,
                          })
                        }
                      />
                    ))}
                  </>
                ))}
              </Article>
            )}
            {store.contacts?.length > 0 && <Article title="Contacts"></Article>}
          </>
        )}
      </div>
    </Template>
  );
};
