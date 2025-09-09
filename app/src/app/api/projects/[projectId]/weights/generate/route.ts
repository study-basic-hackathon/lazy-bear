import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock implementation of the AI client
const mockAiClient = {
  generateWeightCandidates: async (projectId: string) => {
    // projectId is not used in this mock, but would be in a real implementation
    console.log(`Generating weight candidates for project: ${projectId}`);

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data that conforms to the API specification
    return [
      {
        area: 'テクノロジ系',
        weightPercent: 50,
      },
      {
        area: 'マネジメント系',
        weightPercent: 30,
      },
      {
        area: 'ストラテジ系',
        weightPercent: 20,
      },
    ];
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  if (!projectId) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  try {
    // Call the mock AI client to get weight candidates
    const weightCandidates = await mockAiClient.generateWeightCandidates(projectId);

    return NextResponse.json(weightCandidates, { status: 200 });
  } catch (error) {
    console.error('Error generating weight candidates:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
