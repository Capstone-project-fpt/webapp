import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function SettingCard(props: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  accordion?: string;
}) {
  return (
    <Card>
      {(props.title || props.description) && (
        <CardHeader>
          {props.title && <CardTitle>{props.title}</CardTitle>}
          {props.description && (
            <CardDescription>{props.description}</CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent className="flex flex-col gap-4">
        {props.accordion ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{props.accordion}</AccordionTrigger>
              <AccordionContent>{props.children}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          props.children
        )}
      </CardContent>
      {props.actions && (
        <CardFooter>
          <div className="w-full flex justify-end gap-2">{props.actions}</div>
        </CardFooter>
      )}
    </Card>
  );
}
