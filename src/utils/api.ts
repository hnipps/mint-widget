export const getSignature = async (
  address: string,
  quantity: number,
  projectId: string
) => {
  try {
    const signatureResult = await fetch(
      `${process.env.REACT_APP_API_BASE_URI}/signature?account=${address}&quantity=${quantity}&projectId=${projectId}`
    );

    if (signatureResult.status !== 200) {
      throw new Error(
        "This wallet does not have access to the sale right now."
      );
    }

    const { signature }: { signature: string } = await signatureResult.json();

    return { signature };
  } catch (error) {
    console.error(error);

    return { error };
  }
};

export const checkClaim = async (
  address: string,
  projectId: string
): Promise<number> => {
  try {
    const claimResult = await fetch(
      `${process.env.REACT_APP_API_BASE_URI}/check-claim?account=${address}&projectId=${projectId}`
    );

    if (claimResult.status !== 200) {
      throw new Error("Cannot check claim.");
    }

    const { quantity } = await claimResult.json();

    return quantity;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
