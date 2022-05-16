import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function giveRightToVote(ballotContract: Ballot, voterAddress: any) {
  const tx = await ballotContract.giveRightToVote(voterAddress);
  await tx.wait();
}

describe("Ballot", function () {
  let ballotContract: Ballot;
  let accounts: any[];

  this.beforeEach(async function () {
    accounts = await ethers.getSigners();
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount.toNumber()).to.eq(0);
      }
    });

    it("sets the deployer address as chairperson", async function () {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address);
    });

    it("sets the voting weight for the chairperson as 1", async function () {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairpersonVoter.weight.toNumber()).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      const voter = await ballotContract.voters(voterAddress);
      expect(voter.weight.toNumber()).to.eq(1);
    });

    it("can not give right to vote for someone that has voted", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.connect(accounts[1]).vote(0);
      await expect(
        giveRightToVote(ballotContract, voterAddress)
      ).to.be.revertedWith("The voter already voted.");
    });

    it("can not give right to vote for someone that has already voting rights", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await expect(
        giveRightToVote(ballotContract, voterAddress)
      ).to.be.revertedWith("");
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    it("one vote is counted", async function () {
      const proposalToVoteFor = 0;
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.vote(proposalToVoteFor);
      const winningProposal = await ballotContract.winningProposal();
      expect(winningProposal).to.eq(proposalToVoteFor);

      // checks contract state is correct. One vote for 0, zero votes for rest
      PROPOSALS.forEach(async (name,index) => {
        let expectedVotes = 0;
        if (index === proposalToVoteFor) {
          expectedVotes = 1;
        }

        const votes = await ballotContract.proposals(index);
        expect(votes.voteCount).to.eq(expectedVotes);
      });
    });

    it("must have right to vote", async function () {
      await expect(
        ballotContract.connect(accounts[1]).vote(0)
      ).to.be.revertedWith('Has no right to vote');
    });

    it("voter cannot vote twice", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.connect(accounts[1]).vote(0);
      await expect(
        ballotContract.connect(accounts[1]).vote(1)
      ).to.be.revertedWith("Already voted.");
    });

    it("many votes leads to correct winner", async function () {
      // 3 votes for Proposal 1
      // 2 votes for Proposal 2
      // 1 vote  for Proposal 3

      expect(accounts.length).to.gte(6);
      await giveRightToVote(ballotContract, accounts[1].address);
      await giveRightToVote(ballotContract, accounts[2].address);
      await giveRightToVote(ballotContract, accounts[3].address);
      await giveRightToVote(ballotContract, accounts[4].address);
      await giveRightToVote(ballotContract, accounts[5].address);

      await ballotContract.vote(0);
      await ballotContract.connect(accounts[1]).vote(0);
      await ballotContract.connect(accounts[2]).vote(0);
      await ballotContract.connect(accounts[3]).vote(1);
      await ballotContract.connect(accounts[4]).vote(1);
      await ballotContract.connect(accounts[5]).vote(2);

      const winningProposal = await ballotContract.winningProposal();
      expect(winningProposal).to.eq(0);
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO more tests?
    it("voter can delegate", async function () {
      await giveRightToVote(ballotContract, accounts[1].address);
      await giveRightToVote(ballotContract, accounts[2].address);

      await ballotContract.connect(accounts[1]).delegate(accounts[2].address);
      await ballotContract.connect(accounts[2]).vote(0);

      // accounts[2] voter weight should now be 2
      const voter = await ballotContract.voters(accounts[2].address);
      expect(voter.weight.toNumber()).to.eq(2);

      // winner should now have 2 votes
      const votes = await ballotContract.proposals(0);
      expect(votes.voteCount).to.eq(2);
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    it("only owner can give right to vote", async function () {
      /* Getting the address of the second account. */
      const voterAddress = accounts[2].address;
      await expect(
        ballotContract.connect(accounts[1]).giveRightToVote(voterAddress)
      ).to.be.revertedWith('Only chairperson can give right to vote');
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    it("cannot vote if not given the right to vote", async function () {
      await expect(
        ballotContract.connect(accounts[1]).vote(0)
      ).to.be.revertedWith('Has no right to vote');
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO more tests?
    it("a non-voter cannot delegate", async function () {
      const delegatorAddress = accounts[1].address;
      await ballotContract.giveRightToVote(delegatorAddress);
      await expect(
        ballotContract.connect(accounts[1]).delegate(accounts[2].address)
      ).to.be.revertedWith('');
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    it("winningProposal is zero before any cast votes", async function () {
      expect(await ballotContract.winningProposal()).to.eq(0);
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    it("winningProposal correctly shows winner", async function () {
      const voterAddress = accounts[1].address;
      const winningProposalIndex = 1;
      await ballotContract.giveRightToVote(voterAddress);
      await ballotContract.connect(accounts[1]).vote(winningProposalIndex)

      expect(await ballotContract.winningProposal()).to.eq(winningProposalIndex);
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    it("Report winner name as first proposal before any votes are cast", async function () {
      const winner = await ballotContract.winnerName();
      const name =  ethers.utils.parseBytes32String(winner);
      expect(name).to.eq('Proposal 1');
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    it("Correctly report winner name", async function () {
      const voterAddress = accounts[1].address;
      const winningProposalIndex = 1;
      await ballotContract.giveRightToVote(voterAddress);
      await ballotContract.connect(accounts[1]).vote(winningProposalIndex)

      const winner = await ballotContract.winnerName();
      const name =  ethers.utils.parseBytes32String(winner);
      expect(name).to.eq('Proposal 2');
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    it("Winner name properly reports winning proposal", async function () {
      for (let i=1; i<=5; i++) {
        await ballotContract.giveRightToVote(accounts[i].address);
      }
      
      await ballotContract.connect(accounts[1]).vote(1);
      await ballotContract.connect(accounts[2]).vote(1);
      await ballotContract.connect(accounts[3]).vote(1);
      await ballotContract.connect(accounts[4]).vote(2);
      await ballotContract.connect(accounts[5]).vote(0);

      const winner = await ballotContract.winnerName();
      const name =  ethers.utils.parseBytes32String(winner);
      expect(name).to.eq('Proposal 2');
    });
  });
});
