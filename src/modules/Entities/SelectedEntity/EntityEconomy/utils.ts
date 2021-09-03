import { ProposalsType } from './types'

export const mapProposalToRedux = (proposal: any): ProposalsType => {
    const {
        proposal_id,
        content,
        status,
        final_tally_result,
        total_deposit,
        submit_time,
        deposit_end_time,
        voting_end_time,
        voting_start_time,
    } = proposal;
    return {
        proposalId: proposal_id,
        proposer: '',   //  get from    /gov/proposals/{proposalId}/proposer
        content: content,
        tally: {
            yes: final_tally_result.yes,
            no: final_tally_result.no,
            noWithVeto: final_tally_result.no_with_veto,
            abstain: final_tally_result.abstain,
        },
        status: status,
        totalDeposit: total_deposit,
        submitTime: submit_time,
        DepositEndTime: deposit_end_time,
        votingStartTime: voting_start_time,
        votingEndTime: voting_end_time,
    }
}
