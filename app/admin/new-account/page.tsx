import { PageTitle } from "@/components/admin/ui";
import NewAccountForm from "@/components/admin/NewAccountForm";

export default function NewAccountPage() {
  return (
    <div className="max-w-lg">
      <PageTitle
        title="Create account"
        desc="Add another backoffice user. They still need to be in ADMIN_EMAILS to sign in."
      />
      <NewAccountForm />
    </div>
  );
}
