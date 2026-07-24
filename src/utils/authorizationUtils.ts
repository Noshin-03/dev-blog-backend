import { Request } from 'express';

const METHOD_TO_ACTION: Record<string, string> = {
    GET: 'read',
    POST: 'create',
    PATCH: 'update',
    PUT: 'update',
    DELETE: 'delete',
};

export function extractResourceFromPath(path: string): string {
    const segments = path.replace(/^\//, '').split('/').filter(Boolean);

    for (let i = segments.length - 1; i >= 0; i--) {
        if (!segments[i].match(/^\d+$/)) {
            return segments[i];
        }
    }

    return '';
}

export function mapMethodToAction(method: string): string {
    return METHOD_TO_ACTION[method.toUpperCase()] || 'read';
}

export function getResourceAndAction(
    req: Request,
    resourceOverride?: string,
    actionOverride?: string,
): { resource: string; action: string } {
    const fullPath = req.baseUrl || req.path;
    const resource = resourceOverride || extractResourceFromPath(fullPath);
    const action = actionOverride || mapMethodToAction(req.method);

    return { resource, action };
}
