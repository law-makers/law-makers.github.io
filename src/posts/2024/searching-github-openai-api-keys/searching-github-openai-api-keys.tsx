import {Post} from '../../Post';

export class SearchingGitHubForOpenAIApiKeys extends Post {
    public name = 'Searching GitHub for OpenAI API Keys';
    public slug = 'searching-github-openai-api-keys';
    public date = new Date('10 Jun 2024');
    public hidden = false;
    public excerpt = 'How to search for OpenAI API keys on GitHub using regular expressions.';
    public keywords = ['OpenAI', 'GitHub', 'API keys', 'security'];
    public render() {
        return (
            <>
                <h1>Searching GitHub for OpenAI API Keys</h1>
                <p>OpenAI API keys are in the format:</p>
                <pre>sk-{'<'}40 case-sensitive alphanumeric characters{'>'}</pre>
                <p>A simple regular expression for this would be:</p>
                <pre>/sk-[a-zA-Z0-9]{'{40,}'}/</pre>
                <p>
                    This matches any string that starts with “sk-” followed by at least 40 alphanumeric characters.
                </p>
                <p>
                    GitHub allows regular expression search, but note that if the search is too expensive you’ll get a 5XX response.
                </p>
                <p>
                    I noticed that modifying it to limit to the start of a line, i.e., <code>/^sk-[a-zA-Z0-9]{'{40,}'}/</code> yields better results.
                </p>
                <p>
                    <a href="https://github.com/search?q=%5E%22sk-%5Ba-zA-Z0-9%5D%7B40%2C%7D%22" target="_blank" rel="noopener noreferrer">Click here to search for OpenAI API keys</a>
                </p>
                <p>Right now it should return a few results. A few thoughts:</p>
                <ul>
                    <li>
                        I’m not sure if GitHub is sending alerts for API keys being committed to codebases. They absolutely should if they’re not.
                    </li>
                    <li>
                        OpenAI should allow permission scoping of API keys.
                    </li>
                    <li>
                        Limiting API keys based on IP CIDR ranges would also be useful.
                    </li>
                </ul>
            </>
        );
    }
}
