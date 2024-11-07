export interface WorldIDVerificationProps {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
  signal?: string;
}

export interface VerificationResponse {
  code: "success" | "failure";
  wldResponse: {
    success: boolean;
    error?: string;
    data?: any;
  };
}
