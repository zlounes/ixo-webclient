import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import styled from 'styled-components'
import { ProgressBar } from 'common/components/ProgressBar'
import BigNumber from 'bignumber.js'
import IMG_expand from 'assets/images/eco/icon-expand.svg'
import IMG_wait from 'assets/images/eco/wait.svg'
import IMG_decision_textfile from 'assets/images/eco/decision/textfile.svg'
import IMG_decision_pdf from 'assets/images/eco/decision/pdf.svg'
import {
  gridSizes,
  WidgetWrapper,
} from 'common/components/Wrappers/WidgetWrapper'
import {
  ClaimsLabels,
  ClaimsWidget,
  ProgressContainer,
  SectionHeader,
} from 'modules/Entities/SelectedEntity/EntityImpact/Overview/components/Dashboard/Dashboard.styles'
import { CircleProgressbar } from 'common/components/Widgets/CircleProgressbar/CircleProgressbar'
import moment from 'moment'
import { Coin, VoteStatus } from '../../types'
import { RootState } from 'common/redux/types'
import { useSelector } from 'react-redux'
import { getBalanceNumber } from 'common/utils/currency.utils'
import CopyToClipboard from 'react-copy-to-clipboard'
import { thousandSeparator } from 'common/utils/formatters'

const Container = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f2f5fb 100%);
  box-shadow: 0px 4px 25px #e1e5ec;
  border-radius: 4px;
  padding: 20px;
  margin: 0px 0px 30px 0px;
`

const NumberBadget = styled.span`
  background: #e9edf5;
  border-radius: 9px;
  padding: 5px;
  color: #39c3e6;
  font-size: 14px;
  line-height: 16px;
`
const TypeBadget = styled.span`
  background: #107591;
  border-radius: 24px;
  font-size: 14px;
  line-height: 16px;
  color: #83d9f2;
  padding: 5px 10px;
  margin-left: 10px;
`

const Title = styled.div`
  font-size: 22px;
  line-height: 28px;
  color: #333333;
`

const LabelSM = styled.span`
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.3px;
  color: #333333;

  &.bold {
    font-weight: bold;
  }
`
const LabelLG = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #333333;
`
const Action = styled.button`
  border-radius: 4px;
  padding: 10px 30px;
  border: #39c3e6 1px solid;
  color: #333333;
  background-color: transparent;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;

  &.disable {
    border: transparent 1px solid;
    background-color: #e9edf5;
    color: #bdbdbd;
  }
`

const DecisionIMG = styled.img`
  height: 30px;
`

export enum ProposalType {
  Membership = 'Membership',
  Budget = 'Budget',
}

interface GovernanceProposalProps {
  proposalId: number
  type: ProposalType
  announce: string
  proposedBy: string
  submissionDate: string
  closeDate: string
  votes: string | number
  available: string | number
  totalDeposit: Coin
}

const GovernanceProposal: React.FunctionComponent<GovernanceProposalProps> = ({
  proposalId,
  type,
  announce,
  proposedBy,
  submissionDate,
  closeDate,
  votes,
  available,
  totalDeposit,
}) => {
  const { address } = useSelector((state: RootState) => state.account)
  const [myVoteStatus, setMyVoteStatus] = useState<VoteStatus>(
    VoteStatus.VOTE_OPTION_UNSPECIFIED,
  )
  const [votingPeriod, setVotingPeriod] = useState<number>(0)
  const [votingRemain, setVotingRemain] = useState<number>(0)

  const getMyVoteStatus = () => {
    return Axios.get(
      `${process.env.REACT_APP_GAIA_URL}/gov/proposals/${proposalId}/votes/${address}`,
    )
  }

  const myFormat = (min): string => {
    var x = moment.utc(min * 60 * 1000)
    var dayNum: number = Number(x.format('D')) - 1
    return `${('0' + dayNum).slice(-2)}d ${x.format('H[h] mm[m]')} `
  }

  const formatDeposit = (coin: Coin): string => {
    if (coin.denom === 'uixo') {
      return `${getBalanceNumber(new BigNumber(coin.amount)).toFixed(2)} IXO`
    }
    return `${coin.amount} ${coin.denom}`
  }

  useEffect(() => {
    getMyVoteStatus()
      .then(response => response.data)
      .then(data => data.result)
      .then(result => result.option)
      .then(option => setMyVoteStatus(option))
      .catch(e => console.log(e))

    setVotingPeriod(
      moment.utc(closeDate).diff(moment.utc(submissionDate), 'minutes'),
    )
    setVotingRemain(moment.utc(closeDate).diff(moment().utc(), 'minutes'))
    // eslint-disable-next-line
  }, [])

  return (
    <Container className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-sm-6'>
          <div className='d-flex align-items-center justify-content-between pb-3'>
            <div>
              <NumberBadget>#{proposalId}</NumberBadget>
              <TypeBadget>{type}</TypeBadget>
            </div>
            <div>
              <img src={IMG_expand} alt='message' height='30px' />
            </div>
          </div>

          <Title className='pb-3'>{announce}</Title>

          <div className='d-flex align-items-center'>
            <img src={IMG_wait} alt='remain' height='20px' />
            <div className='d-inline-block w-100 pl-3'>
              <ProgressBar
                total={votingPeriod}
                approved={votingRemain}
                rejected={0}
                height={22}
                activeBarColor='#39c3e6'
                closedText='Closed'
              />
            </div>
          </div>

          <div className='text-right'>
            <LabelSM className='bold'>
              {votingRemain > 0 && myFormat(votingRemain)}
            </LabelSM>
            <LabelSM>
              {votingRemain > 0 ? 'remaining' : 'Voting period is now closed'}
            </LabelSM>
          </div>

          <div className='row'>
            <div className='col-6 pb-3'>
              <LabelSM>Proposed by</LabelSM>
              <br />
              <LabelLG style={{ cursor: 'pointer' }} title='Click to copy'>
                <CopyToClipboard text={proposedBy}>
                  <span>{proposedBy.substring(0, 10)}{proposedBy && '...'}</span>
                </CopyToClipboard>
              </LabelLG>
            </div>
            <div className='col-6 pb-3'>
              <LabelSM>Deposit</LabelSM>
              <br />
              <LabelLG>{formatDeposit(totalDeposit)}</LabelLG>
            </div>
            <div className='col-6 pb-3'>
              <LabelSM>Submission Date</LabelSM>
              <br />
              <LabelLG>
                {moment
                  .utc(submissionDate)
                  .format('YYYY-MM-DD [at] HH:mm [UTC]')}
              </LabelLG>
            </div>
            <div className='col-6 pb-3'>
              <LabelSM>{votingRemain > 0 ? 'Closes' : 'Closed'}</LabelSM>
              <br />
              <LabelLG>
                {moment.utc(closeDate).format('YYYY-MM-DD [at] HH:mm [UTC]')}
              </LabelLG>
            </div>
          </div>

          <div className='d-flex justify-content-between align-items-center pt-2'>
            <Action
              className={
                myVoteStatus === VoteStatus.VOTE_OPTION_YES ? 'disable' : ''
              }
            >
              {myVoteStatus === VoteStatus.VOTE_OPTION_YES
                ? 'My Vote'
                : 'New Vote'}
            </Action>
            <div>
              <DecisionIMG
                className='pr-2'
                src={IMG_decision_textfile}
                alt='decision1'
              />
              <DecisionIMG src={IMG_decision_pdf} alt='decision2' />
            </div>
          </div>

          <LabelSM className='bold'>{thousandSeparator(votes)} YES</LabelSM>
          <LabelSM>{`(of ${thousandSeparator(available)} available)`}</LabelSM>
        </div>
        <div className='col-12 col-sm-6'>
          <WidgetWrapper
            title=''
            gridHeight={gridSizes.standard}
            light={true}
            padding={false}
          >
            <ClaimsWidget className='p-0 m-0'>
              <ClaimsLabels>
                <div className='pl-0'>
                  <SectionHeader>
                    <strong>Current status: Proposal Passes</strong>
                  </SectionHeader>
                  <div className='pl-4'>
                    <p>
                      <strong>{567}</strong> Yes (64%)
                    </p>
                    <p>
                      <strong>{362}</strong> No (32%)
                    </p>
                    <p>
                      <strong>{58}</strong> No with Veto (8%)
                    </p>
                    <p>
                      <strong>{800}</strong> have not yet voted (44%)
                    </p>
                  </div>
                </div>
                <div className='mt-2'>
                  <SectionHeader>
                    <strong>Consensus thresholds</strong>
                  </SectionHeader>
                  <div className='pl-5'>
                    <div>
                      <strong>+ 10</strong>% more than the quorum of 40%
                    </div>
                    <div>
                      <strong>+ 14</strong>% in favour over the 50% required
                    </div>
                    <div>
                      <strong>- 7</strong>% under the 15% required to veto
                    </div>
                  </div>
                </div>
              </ClaimsLabels>
              <ProgressContainer>
                <CircleProgressbar
                  approved={567}
                  rejected={362}
                  pending={58}
                  totalNeeded={1787}
                  descriptor={<>In favour of the Proposal</>}
                  percentageFormat={true}
                />
              </ProgressContainer>
            </ClaimsWidget>
          </WidgetWrapper>
        </div>
      </div>
    </Container>
  )
}

export default GovernanceProposal
