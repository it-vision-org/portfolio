import { getContacts } from "@/actions/contactActions";
import { PageTitle } from "@/components/admin/ui";
import ContactsInbox from "@/components/admin/ContactsInbox";

export const dynamic = "force-dynamic";

export default async function ContactsAdminPage() {
  const contacts = await getContacts();
  return (
    <div>
      <PageTitle title="Messages" desc="Submissions from the contact form." />
      <ContactsInbox initial={contacts} />
    </div>
  );
}
