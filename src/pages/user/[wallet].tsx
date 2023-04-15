import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { getUserData } from '@/api';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import { EarthGlobIcon } from '@/components/icons/EarthGlobIcon';
import { PhoneIcon } from '@/components/icons/PhoneIcon';
import { TelegramLightIcon } from '@/components/icons/TelegramLightIcon';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { UserData } from '@/types';
import { truncateString } from '@/utils/truncateString';

const statusChipType: any = {
  pending: 'border-yellow-400 text-yellow-400',
  'in progress': 'border-yellow-400 text-yellow-400',
  complete: 'border-brandGreen-100 text-brandGreen-100',
  dispute: 'border-brandRed-100 text-brandRed-200',
};

const clients = [
  '/assets/images/client1.png',
  '/assets/images/client2.jpeg',
  '/assets/images/client3.png',
  '/assets/images/client4.jpeg',
  '/assets/images/client5.png',
  '/assets/images/client6.webp',
];

const WalletPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const [projects, setProjects] = useState<any | null>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [disputedCount, setDisputedCount] = useState(0);
  const [successfulCount, setSuccessfulCount] = useState(0);

  const [error, setError] = useState(false);
  const router = useRouter();

  const { wallet } = router.query;

  useEffect(() => {
    if (wallet) {
      getUserData(wallet as string)
        .then((res) => {
          if (res.data) {
            console.log('res.data');
            setUserData(res.data.user);
            let sum = 0;

            let projectSuccessCount = 0;
            let projectDisputeCount = 0;

            const projectsData = res.data?.projects.reduce(
              (group: any, project: any) => {
                const groupdata = group;
                const { client } = project;
                groupdata[client] = groupdata[client] ?? [];
                if (project.status === 'complete') {
                  sum += Number(project.project_invoice.amount);
                  projectSuccessCount += 1;
                }
                if (project.status === 'dispute') {
                  projectDisputeCount += 1;
                }
                groupdata[client].push(project);
                return groupdata;
              },
              {}
            );
            // complete, in progress, pending, dispute.
            const statusesByOrder = [
              'complete',
              'in progress',
              'pending',
              'dispute',
            ];

            Object.entries(projectsData).forEach(([client, clientProjects]) => {
              const sortedClientProjects = clientProjects.sort((a, b) => {
                return (
                  statusesByOrder.indexOf(a.status) -
                  statusesByOrder.indexOf(b.status)
                );
              });
              projectsData[client] = sortedClientProjects;
            });

            setProjects(projectsData);
            setDisputedCount(projectDisputeCount);
            setSuccessfulCount(projectSuccessCount);
            setTotalEarnings(sum);
          }
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [wallet]);

  const renderClientTotal = (client: any) => {
    let clientSum = 0;
    client.forEach((item: any) => {
      if (item.status === 'complete') {
        clientSum += Number(item.project_invoice.amount);
      }
    });

    return `Total earnings: ${clientSum.toFixed(4)} xDAI`;
  };

  return (
    <>
      <Main meta={<Meta title="JOBA" description="JOBA" />}>
        <Header className="bg-white" />
        <Container>
          <div className="flex flex-col items-center justify-center">
            {!error ? (
              <div className="mx-auto w-full overflow-hidden rounded-2xl bg-white text-left align-middle transition-all">
                <div className="p-6 text-sm font-semibold text-primary-100">
                  <div className="flex rounded-md border border-gray-400 p-4 text-lg text-brandGray-500">
                    <div>
                      <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-brandGray-100">
                        <img
                          className="h-full w-full"
                          src={userData?.profile_photo}
                          alt={userData?.wallet_address}
                        />
                      </div>

                      <div className="m-4 flex justify-between">
                        <div className="">
                          <h2 className="text-xl font-bold text-black">
                            {`${userData?.display_name || ''} (
                            ${truncateString({
                              string: userData?.wallet_address || '',
                              afterDotsStringLength: 3,
                            })}
                            )`}
                          </h2>
                          <p className="text-base font-normal">
                            {userData?.email}
                          </p>

                          <div className="mt-3">
                            {userData?.phone?.country_code &&
                              userData?.phone?.number && (
                                <p className="flex items-center text-sm font-normal">
                                  <PhoneIcon className="mr-2 h-3 w-3 stroke-black" />
                                  {`+${userData?.phone?.country_code} ${userData?.phone?.number}`}
                                </p>
                              )}

                            {userData?.residential_address?.street_address && (
                              <p className="mt-1 flex items-center text-sm font-normal">
                                <EarthGlobIcon className="mr-2 h-4 w-4 stroke-black" />
                                {`${userData?.residential_address?.street_address}, ${userData?.residential_address?.city}, ${userData?.residential_address?.country}`}
                              </p>
                            )}

                            {userData?.telegram_user_link && (
                              <p className="mt-1 flex items-center text-sm font-normal">
                                <TelegramLightIcon className="mr-2 h-4 w-4 stroke-black" />
                                {userData?.telegram_user_link}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="mx-auto max-h-3 self-center"
                      onClick={() => {
                        window.open(`/create-project`);
                      }}
                    >
                      Hire me!
                    </Button>
                  </div>

                  <div className=" py-10">
                    <h3 className="mb-4 text-xl">
                      Projects (total earnings: {totalEarnings.toFixed(4)} xDAI)
                    </h3>
                    <h3 className="mb-4 text-xl">
                      Completed Projects: {successfulCount}
                    </h3>
                    <h3 className="mb-4 text-xl">
                      Disputed Projects: {disputedCount}
                    </h3>
                    <div className="">
                      {projects &&
                        Object.keys(projects).map((clientAddress, index) => (
                          <div
                            key={clientAddress}
                            className="mb-4 border-b border-gray-100"
                          >
                            <div className="py-4 text-sm">
                              <img
                                className="mb-2 h-10 w-auto"
                                src={clients[index]}
                                alt={clientAddress}
                              />
                              <div className="pt-2 font-semibold">
                                {renderClientTotal(projects[clientAddress])}
                              </div>
                            </div>

                            <div>
                              {projects[clientAddress] &&
                                projects[clientAddress].map((project: any) => (
                                  <div
                                    className="mb-4 bg-gray-100 p-5 font-normal"
                                    key={project.id}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="text-sm font-semibold text-black">
                                        {project.name}
                                      </div>
                                      <div
                                        className={`cursor-pointer rounded-full border p-1 px-3 text-[10px] font-semibold uppercase hover:opacity-80 ${
                                          statusChipType[`${project.status}`]
                                        }`}
                                      >
                                        {project.status}
                                      </div>
                                    </div>
                                    <p className="mt-1 font-normal">
                                      {project.description}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4">No user found.</p>
            )}
          </div>
        </Container>
      </Main>
    </>
  );
};

export default WalletPage;
