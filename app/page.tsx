import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/shared/container";
import { Surface } from "@/components/shared/surface";
import {
  Body,
  BodySmall,
  Caption,
  H1,
  LabelText,
} from "@/components/shared/typography";
import { ICON_SIZES } from "@/lib/icons";

/**
 * Foundation checkpoint only.
 * NOT a landing page, dashboard, auth, or reminders UI.
 * This placeholder verifies the design-system primitives load correctly
 * until approved Stitch screens are implemented one by one.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      <Container className="flex flex-1 flex-col justify-center py-16">
        <div className="max-w-xl">
          <Caption>RONTEE · FOUNDATION READY</Caption>
          <H1 className="mt-3">Never forget what matters.</H1>
          <Body className="mt-3 text-muted">
            Technical foundation and design tokens are configured. Product
            screens will be built later from approved Stitch designs.
          </Body>
        </div>

        <Surface className="mt-8 max-w-xl" padding="md">
          <LabelText>Primitive check</LabelText>
          <BodySmall className="mt-1 text-muted">
            Button · Input · Label · Separator · Surface · Manrope · theme
            tokens.
          </BodySmall>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="foundation-input">Example input (inactive)</Label>
              <Input
                id="foundation-input"
                placeholder="Calm, light, accessible input"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button>
                <Bell size={ICON_SIZES.default} aria-hidden />
                Primary
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <Separator className="my-5" />

          <BodySmall className="text-muted">
            Light / Dark / System is wired globally via next-themes. Theme
            switcher UI comes later.
          </BodySmall>
        </Surface>
      </Container>
    </main>
  );
}
