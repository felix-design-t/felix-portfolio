import type { Metadata } from "next";
import Image from "next/image";
import { AnnotatedImage } from "@/components/case-study/annotated-image";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { ComparisonSlider } from "@/components/case-study/comparison-slider";
import { FlowCarousel } from "@/components/case-study/FlowCarousel";
import { IterationTimeline } from "@/components/case-study/IterationTimeline";
import { ImagePair } from "@/components/case-study/image-pair";
import { ResultsComparison } from "@/components/case-study/ResultsComparison";
import { SuccessResults } from "@/components/case-study/SuccessResults";
import { StaircaseDiagram } from "@/components/case-study/StaircaseDiagram";
import {
  approachOneNotes,
  approachTwoNotes,
  designChangeSteps,
  expenseManagement,
  furtherTestingResults,
  informationLevels,
  iterationOneNotes,
  iterationSlides,
  overloadNotes,
  overloadRiskNotes,
  problemNotes,
  successBlocks,
} from "@/content/case-studies/expense-redesign";
import "@/components/case-study/analysis-frame.css";
import "@/components/case-study/cover-sequence.css";

export const metadata: Metadata = {
  title: expenseManagement.title,
};

/**
 * A fixed route wins over /work/[slug], so this study gets the full
 * template while the other projects keep their placeholder page.
 *
 * The cover is the home card's picture: the same frame, with the
 * dashboard set in from the top and left and running off the other edges.
 */
export default function ExpenseManagementPage() {
  return (
    <CaseStudyPage
      study={expenseManagement}
      cover={
        <>
          {/* Holds the home plate's shape. The screenshot sits on top of it. */}
          <div className="cover-sequence" aria-hidden="true" />
          <div className="work-slot-media">
            <Image
              className="work-slot-shot"
              data-theme-image="light"
              src="/work/expense-redesign/cover.png"
              alt="Redesigned Paycom expense dashboard"
              width={861}
              height={714}
              sizes="(max-width: 640px) 90vw, 480px"
            />
            <Image
              className="work-slot-shot"
              data-theme-image="dark"
              src="/work/expense-redesign/cover-dark.jpg"
              alt="Redesigned Paycom expense dashboard"
              width={1152}
              height={864}
              sizes="(max-width: 640px) 90vw, 480px"
            />
          </div>
        </>
      }
      visuals={{
        "further-testing": (
          <ResultsComparison data={furtherTestingResults} />
        ),
        "outcome-overview": (
          <ComparisonSlider
            beforeSrc="/work/expense-redesign/legacy.png"
            afterSrc="/work/expense-redesign/redesign.png"
            beforeLabel="Legacy"
            afterLabel="Redesign"
          />
        ),
        problem: (
          <AnnotatedImage
            src="/work/expense-redesign/problem.png"
            alt="Legacy expense dashboard"
            width={1050}
            height={866}
            notes={problemNotes}
          />
        ),
      }}
      ideaVisuals={{
        analysis: [
          <div key="analysis-1" className="analysis-diagram">
            <img
              src="/work/expense-redesign/analysis-1.png?v=2"
              alt=""
              width={1311}
              height={813}
              draggable={false}
            />
            <div className="analysis-flow-copy analysis-flow-callout">
              <p>Underrepresented Users: Admins / Senior Level Managers</p>
              <p>Unmet Needs: Visibility</p>
            </div>
            <p
              className="analysis-flow-node"
              style={{ left: "0%", top: "54.74%", width: "14.8%", height: "23.99%" }}
            >
              Table of
              <br />
              Submitted
              <br />
              Expenses
            </p>
            <p
              className="analysis-flow-node"
              style={{ left: "26.32%", top: "54.74%", width: "14.8%", height: "23.99%" }}
            >
              Review Details
            </p>
            <p
              className="analysis-flow-node"
              style={{
                left: "63.16%",
                top: "66.9%",
                width: "18%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Are all details
              <br />
              comply
            </p>
            <p
              className="analysis-flow-node analysis-flow-branch"
              style={{ left: "79.33%", top: "56.03%" }}
            >
              Yes
            </p>
            <p
              className="analysis-flow-node analysis-flow-branch"
              style={{ left: "79.6%", top: "77.43%" }}
            >
              No
            </p>
            <p
              className="analysis-flow-node"
              style={{ left: "85.13%", top: "33.58%", width: "14.8%", height: "23.86%" }}
            >
              Approve
            </p>
            <p
              className="analysis-flow-node"
              style={{ left: "85.13%", top: "76.01%", width: "14.8%", height: "23.86%" }}
            >
              Deny or
              <br />
              Other Actions
            </p>
            <p className="analysis-flow-copy" style={{ left: "5%", bottom: 0 }}>
              Current Users: Junior Level Managers
            </p>
          </div>,
          <ImagePair
            key="analysis-2"
            images={[
              {
                src: "/work/expense-redesign/analysis-2.1.png",
                alt: "A cluttered expense table",
                width: 462,
                height: 316,
                notes: overloadNotes,
                asList: true,
              },
              {
                src: "/work/expense-redesign/analysis-2.2.png",
                alt: "Risk indicators separated from the expense a user is acting on",
                width: 438,
                height: 306,
                notes: overloadRiskNotes,
                asList: false,
              },
            ]}
          />,
        ],
        "initial-design": [
          <AnnotatedImage
            key="approach-1"
            src="/work/expense-redesign/approach-1.png"
            alt="Expense dashboard with totals, status, trends, and range exceeded"
            width={1080}
            height={768}
            notes={approachOneNotes}
            asList={false}
          />,
          <AnnotatedImage
            key="approach-2"
            src="/work/expense-redesign/approach-2.png"
            alt="Expense list with status flags and row actions"
            width={998}
            height={530}
            notes={approachTwoNotes}
            asList={false}
          />,
        ],
        "usability-testing": [
          <ul key="test-1" className="testing-metrics">
            <li>
              <p className="testing-metric-value">8/10</p>
              <p className="testing-metric-label">
                <span className="testing-metric-dot" data-tone="good" />
                widget usability
              </p>
            </li>
            <li>
              <p className="testing-metric-value">43%</p>
              <p className="testing-metric-label">
                <span className="testing-metric-dot" data-tone="bad" />
                first click success rate
              </p>
            </li>
            <li>
              <p className="testing-metric-value">6 mins</p>
              <p className="testing-metric-label">
                <span className="testing-metric-dot" data-tone="bad" />
                task completion time
              </p>
            </li>
          </ul>,
          <StaircaseDiagram key="test-2" levels={informationLevels} />,
        ],
        "measuring-success": [
          <SuccessResults key="success" blocks={successBlocks} />,
        ],
        "further-design-changes": [
          <IterationTimeline key="design-changes" steps={designChangeSteps} />,
        ],
        "iteration-approach": [
          <AnnotatedImage
            key="iteration-1"
            src="/work/expense-redesign/iteration-1.png"
            alt="Expense dashboard with Critical Overview and Expense Warnings"
            width={2160}
            height={1536}
            notes={iterationOneNotes}
            asList={false}
          />,
          <FlowCarousel key="iteration-2" slides={iterationSlides} />,
        ],
      }}
    />
  );
}
